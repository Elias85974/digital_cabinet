package org.austral.ing.lab1;

import org.austral.ing.lab1.controller.*;

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

        Spark.init();

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
}
