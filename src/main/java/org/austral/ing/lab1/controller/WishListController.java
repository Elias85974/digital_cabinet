package org.austral.ing.lab1.controller;

import org.austral.ing.lab1.model.User;
import org.austral.ing.lab1.repository.Users;
import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import java.util.Optional;

public class WishListController {
    private final EntityManagerFactory entityManagerFactory;

    public WishListController(EntityManagerFactory entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

    public void init() {
        // Route to get the products of the user's wishlist
        Spark.get("/wishList/:userId", (req, resp) -> {
            Long userId = Long.parseLong(req.params("userId"));

            // Begin Business Logic
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Users usersRepo = new Users(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();

            Optional<User> user = usersRepo.findById(userId);

            tx.commit();
            entityManager.close();

            if (user.isPresent()) {
                resp.status(200);
                resp.type("application/json");
                return user.get().getWishlistsAsJson();
            } else {
                resp.status(404);
                return "User not found";
            }
        });

        // Route to add a product to the user's wishlist
        Spark.post("/wishList/:userId/:product", "application/json", (req, resp) -> {
            Long userId = Long.parseLong(req.params("userId"));
            String product = req.params("product");

            // Begin Business Logic
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Users usersRepo = new Users(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();

            // Call the method to add product to wishlist
            usersRepo.addProductToWishList(userId, product);

            tx.commit();
            entityManager.close();

            resp.status(200);
            return "Product added to wishlist successfully";
        });
    }
}
