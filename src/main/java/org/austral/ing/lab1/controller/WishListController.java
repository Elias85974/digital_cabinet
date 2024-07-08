package org.austral.ing.lab1.controller;

import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import org.austral.ing.lab1.model.user.User;
import org.austral.ing.lab1.repository.users.Users;
import org.austral.ing.lab1.repository.users.WishLists;
import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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

        // Route to remove products from the user's wishlist
        Spark.delete("/wishList/:userId", "application/json", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            WishLists wishListsRepo = new WishLists(entityManager);
            Users usersRepo = new Users(entityManager);
            try {
                Long userId = Long.parseLong(req.params("userId"));
                // Parse the JSON array as a List of Maps
                List<Map<String, Object>> productsList = new Gson().fromJson(req.body(), new TypeToken<List<Map<String, Object>>>(){}.getType());
                // Extract the productName values
                List<String> productNames = productsList.stream()
                        .map(map -> (String) map.get("productName"))
                        .collect(Collectors.toList());
                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();

                Optional<User> user = usersRepo.findById(userId);
                if (user.isEmpty()) {
                    resp.status(404);
                    return "User not found";
                }

                wishListsRepo.removeProductsFromWishList(userId, productNames);

                tx.commit();
                resp.status(200);
                return "Products removed from wishlist successfully";
            } catch (Exception e) {
                if (entityManager.getTransaction().isActive()) {
                    entityManager.getTransaction().rollback();
                }
                resp.status(500);
                return "An error occurred while removing the products from the wishlist, please try again";
            } finally {
                entityManager.close();
            }
        });
    }
}