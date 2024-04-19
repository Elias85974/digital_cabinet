package org.austral.ing.lab1;

import com.google.common.base.Strings;
import com.google.gson.Gson;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.austral.ing.lab1.model.User;
import org.austral.ing.lab1.repository.Users;
import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import java.util.Date;
import java.util.Optional;

import static spark.Spark.halt;

import org.austral.ing.lab1.TokenResponse;

public class Application {

    private static final Gson gson = new Gson();
    public static void main(String[] args) {

        final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("lab1");

        Spark.port(4321);

        // Commenting the line that saves Luke and Leia to the database
        storedBasicUser(entityManagerFactory);

        /* 5. Dynamic Content from Db */
        Spark.get("/persisted-users/:id",
                (req, resp) -> {
                    final String id = req.params("id");

                    /* Business Logic */
                    final EntityManager entityManager = entityManagerFactory.createEntityManager();
                    final EntityTransaction tx = entityManager.getTransaction();
                    tx.begin();
                    User user = entityManager.find(User.class, Long.valueOf(id));
                    tx.commit();
                    entityManager.close();

                    resp.type("application/json");
                    return user.asJson();
                }
        );

        /* 6. Receiving data from client */
        Spark.post("/users", "application/json", (req, resp) -> {
            final User user = User.fromJson(req.body());

            /* Begin Business Logic */
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Users users = new Users(entityManager);
            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            users.persist(user);
            resp.type("application/json");
            resp.status(201);
            tx.commit();
            entityManager.close();
            /* End Business Logic */

            return user.asJson();
        });
        /*const verifyJWT = (req, resp, next) => {
            const token = req.headers("x-access-token");
            if (!token) {
                res.send("No token provided");
            } else{
                jwt.veify(token, "secret", (err, decoded) => {
                    if (err) {
                        res.json(auth: false, message: "Failed to authenticate");
                    } else {
                        req.userId = decoded.id;
                        next();
                    }
                });
            }
        }
        app.get("/isUserAuthenticated", verifyJWT, (req, resp) -> {
            resp.send("Authenticated");
        });*/
        Spark.before("/isUserAuthenticated", (req, resp) -> {
            String token = req.headers("x-access-token");
            if (token == null) {
                halt(401, "No token provided");
            } else {
                try {
                    Jwts.parserBuilder()
                            .setSigningKey(Keys.hmacShaKeyFor("secret".getBytes()))
                            .build()
                            .parseClaimsJws(token);
                } catch (Exception e) {
                    halt(401, "Failed to authenticate");
                }
            }
        });

        Spark.get("/isUserAuthenticated", (req, resp) -> {
            resp.status(200);
            resp.body("Authenticated");
            return null;
        });
        // Endpoint to refresh token
        Spark.post("/refreshToken", "application/json", (req, resp) -> {
            final String refreshToken = req.headers("x-refresh-token");

            // Validate refresh token
            try {
                Jwts.parserBuilder()
                        .setSigningKey(Keys.hmacShaKeyFor("refreshSecret".getBytes()))
                        .build()
                        .parseClaimsJws(refreshToken);
            } catch (Exception e) {
                halt(401, "Failed to authenticate refresh token");
            }

            // Generate new JWT and refresh token
            String newToken = Jwts.builder()
                    .setSubject("userId")
                    .setExpiration(new Date(System.currentTimeMillis() + 60 * 60 * 1000)) // 1 hour
                    .signWith(Keys.hmacShaKeyFor("secret".getBytes()))
                    .compact();

            String newRefreshToken = Jwts.builder()
                    .setSubject("userId")
                    .setExpiration(new Date(System.currentTimeMillis() +  60 * 60 * 1000)) // 1 days
                    .signWith(Keys.hmacShaKeyFor("refreshSecret".getBytes()))
                    .compact();

            // Send new tokens to client
            resp.status(200);
            resp.type("application/json");
            return gson.toJson(new TokenResponse(newToken, newRefreshToken));
        });
        // Requesting a login with a user
        Spark.post("/login", "application/json", (req, resp) -> {
            final User user = User.fromJson(req.body());

            /* Begin Business Logic */
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Users users = new Users(entityManager);
            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            Optional<User> foundUserOptional = users.findByEmail(user.getMail());
            tx.commit();
            entityManager.close();
            /* End Business Logic */

            if (foundUserOptional.isEmpty()) {
                resp.status(404);
                return "User not found";
            }

            User foundUser = foundUserOptional.get();

            if (!foundUser.getPassword().equals(user.getPassword())) {
                resp.status(401);
                return "Invalid password";
            }

            return foundUser.asJson();
        });

        // Requesting a list of all users
        Spark.get("/listUsers", (req, resp) -> {
            /* Begin Business Logic */
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Users users = new Users(entityManager);
            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            final String json = gson.toJson(users.listAll());
            tx.commit();
            entityManager.close();
            /* End Business Logic */

            resp.type("application/json");
            return json;
        });

        // Requesting an inventory of a house
        Spark.get("/house/:id/inventory", (req, resp) -> {
            final String id = req.params("id");

            /* Begin Business Logic */
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            User user = entityManager.find(User.class, Long.valueOf(id));
            tx.commit();
            entityManager.close();

            resp.type("application/json");
            return user.asJson();
        });

        Spark.options("/*", (req, res) -> {
            String accessControlRequestHeaders = req.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                res.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = req.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                res.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        Spark.before((req, res) -> {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "*");
            res.type("application/json");
        });
    }

    private static void storedBasicUser(EntityManagerFactory entityManagerFactory) {
        final EntityManager entityManager = entityManagerFactory.createEntityManager();
        final Users users = new Users(entityManager);

        EntityTransaction tx = entityManager.getTransaction();
        tx.begin();
        if (users.listAll().isEmpty()) {
            final User luke =
                    User.create("luke.skywalker@jedis.org")
                            .setFirstName("Luke")
                            .setLastName("Skywalker").
                            build();
            final User leia =
                    User.create("leia.skywalker@jedis.org")
                            .setFirstName("Leia")
                            .setLastName("Skywalker")
                            .build();

            users.persist(luke);
            users.persist(leia);
        }
        tx.commit();
        entityManager.close();
    }

    private static String capitalized(String name) {
        return Strings.isNullOrEmpty(name) ? name : name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
    }
}

