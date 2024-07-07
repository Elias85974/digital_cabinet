package org.austral.ing.lab1.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import org.austral.ing.lab1.model.user.User;
import org.austral.ing.lab1.repository.users.Users;
import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import java.util.Map;
import java.util.Optional;

public class UserController {
    private final Gson gson = new Gson();
    private final EntityManagerFactory entityManagerFactory;

    public UserController(EntityManagerFactory entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

    public void init() {

        // Route to create a user
        Spark.post("/users", "application/json", (req, resp) -> {
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
                Map<String, String> formData = gson.fromJson(req.body(), new TypeToken<Map<String, String>>() {}.getType());
                String email = formData.get("mail");
                String password = formData.get("password");
                Optional<User> foundUserOptional = users.findByEmail(email);

                if (foundUserOptional.isEmpty()) {
                    resp.status(404);
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

                    // Establecer el encabezado Content-Type
                    resp.type("application/json");

                    // Establecer el encabezado Authorization con el token en el formato Bearer
                    //resp.header("Authorization", "Bearer " + token);

                    // Devolver el objeto JSON como cuerpo de la respuesta
                    return jsonResponse.toString();
                }
                else {
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

        // Route to get the id of a user by mail
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
        Spark.get("/user/:userId/houses", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Users users = new Users(entityManager);
            try {
                final String userId = req.params("userId");
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
    }
}