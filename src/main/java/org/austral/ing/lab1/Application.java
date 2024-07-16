package org.austral.ing.lab1;

import org.austral.ing.lab1.controller.*;

import org.austral.ing.lab1.controller.schedule.SchedulerInitializer;
import spark.HaltException;
import spark.Spark;

import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;

public class Application {

    public static void main(String[] args) {

        final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("lab1");

        Spark.port(4321);

        new DatabaseFiller(entityManagerFactory).init();
        new UserController(entityManagerFactory).init();
        new HouseController(entityManagerFactory).init();
        new InventoryController(entityManagerFactory).init();
        new WishListController(entityManagerFactory).init();
        new InboxController(entityManagerFactory).init();
        new ProductController(entityManagerFactory).init();
        new CategoryController(entityManagerFactory).init();
        new ChatController(entityManagerFactory).init();
        new SchedulerInitializer(entityManagerFactory).init();
        new GoogleController(entityManagerFactory).init();
        TokenValidator.setEntityManagerFactory(entityManagerFactory);

        Spark.options("/*", (req, res) -> {
            String accessControlRequestHeaders = req.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                // Add UserId and Token to the list of allowed headers
                res.header("Access-Control-Allow-Headers", accessControlRequestHeaders + ",UserId,Token");
            }

            String accessControlRequestMethod = req.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                res.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        Spark.before((req, res) -> {
            res.header("Access-Control-Allow-Origin", "*");
            // Explicitly specify which headers are allowed
            res.header("Access-Control-Allow-Headers", "Content-Type,UserId,Token");
            // Expose Token header to the frontend
            res.header("Access-Control-Expose-Headers", "Token");
            res.type("application/json");
        });

        // Apply authentication middleware to protected routes
        Spark.before((request, response) -> {
            if (!request.requestMethod().equals("OPTIONS")) {
                String path = request.pathInfo();
                // Allow requests to /users and /login and /logout to bypass authentication
                if (!path.equals("/register") && !path.equals("/login") && !path.equals("/google-login") && !path.equals("/logout")) {
                    TokenValidator.authenticateRequest(request, response);
                }
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

        Spark.init();
    }
}
