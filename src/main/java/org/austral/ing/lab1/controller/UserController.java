package org.austral.ing.lab1.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import org.austral.ing.lab1.model.user.User;
import org.austral.ing.lab1.object.EmailSender;
import org.austral.ing.lab1.repository.users.Users;
import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Map;
import java.util.Optional;

public class UserController {
    private final Gson gson = new Gson();
    private final EntityManagerFactory entityManagerFactory;


    public UserController(EntityManagerFactory entityManagerFactory ) {
        this.entityManagerFactory = entityManagerFactory;
    }



    public void init() {

        // Route to create a user
        Spark.post("/register", "application/json", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Users users = new Users(entityManager);
            try {
                users.createUserFromJson(req.body());
                resp.type("application/json");
                resp.status(201);

                JsonObject jsonResponse = new JsonObject();
                jsonResponse.addProperty("message", "User created successfully");
                return jsonResponse.toString();
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while creating the user, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to handle the login of a user
        Spark.post("/login", "application/json", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Users users = new Users(entityManager);
            try {
                Map<String, String> formData = gson.fromJson(req.body(), new TypeToken<Map<String, String>>() {
                }.getType());
                String email = formData.get("mail");
                String password = formData.get("password");
                Optional<User> foundUserOptional = users.findByEmail(email);

                if (foundUserOptional.isEmpty()) {
                    resp.status(404);
                    resp.type("message");
                    return "Invalid user or password";
                }

                User foundUser = foundUserOptional.get();

                if (foundUser.getPassword().equals(password)) {
                    //String token = TokenResponse.generateToken(email);

                    // Crear un objeto JSON con el token, el tipo de usuario y el correo electrónico
                    JsonObject jsonResponse = new JsonObject();
                    //jsonResponse.addProperty("token", token);
                    jsonResponse.addProperty("email", foundUser.getMail()); // Correo electrónico del usuario
                    jsonResponse.addProperty("userId", foundUser.getUsuario_ID()); // ID del usuario
                    String token = TokenValidator.generateToken(foundUser.getUsuario_ID());
                    entityManager.getTransaction().begin();
                    foundUser.setToken(token);
                    entityManager.getTransaction().commit();
                    jsonResponse.addProperty("token", token);

                    // Establecer el encabezado Content-Type
                    resp.type("application/json");

                    // Establecer el encabezado Authorization con el token en el formato Bearer
                    //resp.header("Authorization", "Bearer " + token);

                    // Devolver el objeto JSON como cuerpo de la respuesta
                    return jsonResponse.toString();
                } else {
                    resp.status(401);
                    return "Invalid user or password";
                }
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while logging in, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to get the id of a user by mail (unused for now)
        Spark.get("/user/email/:email", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Users users = new Users(entityManager);
            try {
                String mail = req.params("email");
                Optional<User> foundUser = users.findByEmail(mail);

                if (foundUser.isEmpty()) {
                    resp.status(404);
                    return "User not found";
                }

                User user = foundUser.get();
                resp.type("application/json");
                return gson.toJson(user.getUsuario_ID());
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while getting the user, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to list all the users in the database
        Spark.get("/listUsers", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Users users = new Users(entityManager);
            try {
                String usersListJson = gson.toJson(users.listAll());
                resp.type("application/json");
                return usersListJson;
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while listing users, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to get the houses of a given user
        Spark.get("/users/user/getHouses", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Users users = new Users(entityManager);
            try {
                final String userId = req.headers("UserId");
                Optional<User> user = users.findById(Long.parseLong(userId));

                if (user.isEmpty()) {
                    resp.status(404);
                    return "User not found";
                }

                User foundUser = user.get();

                resp.type("application/json");
                return foundUser.getHousesAsJson();
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while getting the houses, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to get all the data from a User
        Spark.get("/users/:userId/getData", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Users users = new Users(entityManager);
            try {
                final String userId = req.params("userId");
                Optional<User> user = users.findById(Long.parseLong(userId));

                if (user.isPresent()) {
                    resp.type("application/json");
                    return user.get().asJson();
                } else {
                    resp.status(404);
                    return "User not found";
                }

            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while getting the user data, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to get edit the data from a User
        Spark.post("/users/editUser/:userId", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Users users = new Users(entityManager);
            try {
                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                final String userId = req.params("userId");
                JsonObject jsonObject = new Gson().fromJson(req.body(), JsonObject.class);
                final String mail = jsonObject.get("email").getAsString();
                final String password = jsonObject.get("password").getAsString();
                final String name = jsonObject.get("name").getAsString();
                final String surname = jsonObject.get("lastName").getAsString();
                final String phone = jsonObject.get("phone").getAsString();
                final String age = jsonObject.get("age").getAsString();

                Optional<User> user = users.findById(Long.parseLong(userId));

                if (user.isEmpty()) {
                    resp.status(404);
                    return "User not found";
                }

                users.modify(user.get().getUsuario_ID(), mail, password, name, surname, phone, Integer.parseInt(age));
                tx.commit();

                resp.type("message");
                return "User data edited successfully";

            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while editing the user data, please try again";
            } finally {
                entityManager.close();
            }
        });

    }
}