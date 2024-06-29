package org.austral.ing.lab1.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import org.austral.ing.lab1.model.User;
import org.austral.ing.lab1.repository.Inboxes;
import org.austral.ing.lab1.repository.Users;
import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class UserController {
    Gson gson = new Gson();
    private final EntityManagerFactory entityManagerFactory;

    public UserController(EntityManagerFactory entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

    public void init() {
        Spark.post("/users", "application/json", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Users users = new Users(entityManager);
            try {
                users.createUserFromJson(req.body());
                resp.type("application/json");
                resp.status(201);
                System.out.println("User created");
                return resp.body();
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while creating the user, please try again";
            } finally {
                entityManager.close();
            }
        });

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
                    return "User not found";
                }

                User foundUser = foundUserOptional.get();

                if (foundUser.getPassword().equals(password)) {
                    //String token = TokenResponse.generateToken(email);

                    // Crear un objeto JSON con el token, el tipo de usuario y el correo electrónico
                    JsonObject jsonResponse = new JsonObject();
                    //jsonResponse.addProperty("token", token);
                    jsonResponse.addProperty("userId", foundUser.getUsuario_ID()); // Correo electrónico del usuario

                    // Establecer el encabezado Content-Type
                    resp.type("application/json");

                    // Establecer el encabezado Authorization con el token en el formato Bearer
                    //resp.header("Authorization", "Bearer " + token);

                    // Devolver el objeto JSON como cuerpo de la respuesta
                    return jsonResponse.toString();
                }
                else {
                    resp.status(401);
                    return "Invalid password";
                }
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while logging in, please try again";
            } finally {
                entityManager.close();
            }
        });

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

        Spark.get("/getInbox/:userId", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Inboxes inboxesRepo = new Inboxes(entityManager);
            try {
                Long userId = Long.parseLong(req.params("userId"));
                List<Map<String, Object>> inboxMessage = inboxesRepo.getHousesByUserId(userId);
                resp.status(200);
                resp.type("application/json");
                return new Gson().toJson(inboxMessage);
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while getting the inbox, please try again";
            } finally {
                entityManager.close();
            }
        });

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