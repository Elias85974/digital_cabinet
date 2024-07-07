package org.austral.ing.lab1.controller;

import org.austral.ing.lab1.model.user.User;
import org.austral.ing.lab1.repository.users.Users;
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
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Users usersRepo = new Users(entityManager);
            try {
                Long userId = Long.parseLong(req.params("userId"));

                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();

                Optional<User> user = usersRepo.findById(userId);

                tx.commit();

                if (user.isPresent()) {
                    resp.status(200);
                    resp.type("application/json");
                    return user.get().getWishlistsAsJson();
                } else {
                    resp.status(404);
                    return "User not found";
                }
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while getting the wishlist, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to add a product to the user's wishlist
        Spark.post("/wishList/:userId/:product", "application/json", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Users usersRepo = new Users(entityManager);
            try {
                Long userId = Long.parseLong(req.params("userId"));
                String product = req.params("product");

                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();

                // Call the method to add product to wishlist
                usersRepo.addProductToWishList(userId, product);

                tx.commit();

                resp.status(200);
                return "Product added to wishlist successfully";
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while adding the product to the wishlist, please try again";
            } finally {
                entityManager.close();
            }
        });
    }
}