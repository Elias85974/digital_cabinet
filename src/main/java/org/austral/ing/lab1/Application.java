package org.austral.ing.lab1;

import org.austral.ing.lab1.controller.*;

import spark.HaltException;
import spark.Spark;

import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

public class Application {

    public static void main(String[] args) {

        final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("lab1");

        Spark.port(4321);

        new UserController(entityManagerFactory).init();
        new HouseController(entityManagerFactory).init();
        new InventoryController(entityManagerFactory).init();
        new TokenController();
        new WishListController(entityManagerFactory).init();
        new InboxController(entityManagerFactory).init();
        new ProductController(entityManagerFactory).init();
        new CategoryController(entityManagerFactory).init();
        new ChatController(entityManagerFactory).init();

        // Apply authentication middleware to protected routes
        Spark.before((request, response) -> {
            String path = request.pathInfo();
            // Allow requests to /users and /login to bypass authentication
            if (!path.startsWith("/users") && !path.startsWith("/login") && !path.startsWith("/logout")) {
                TokenValidator.authenticateRequest(request, response);
            }
        });

        // Global exception handler for HaltException
        Spark.exception(HaltException.class, (exception, request, response) -> {
            // Log the exception or perform additional actions
            System.out.println("HaltException caught: " + exception.getMessage());
            System.out.println(exception.statusCode());
            System.out.println(exception.body());
            // Optionally modify the response
            response.status(403);
            response.body("Unauthorized");
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

        Spark.init();
    }
}
