package org.austral.ing.lab1.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.austral.ing.lab1.model.House;
import org.austral.ing.lab1.model.Inventory;
import org.austral.ing.lab1.model.Product;
import org.austral.ing.lab1.object.ProductInfo;
import org.austral.ing.lab1.repository.Houses;
import org.austral.ing.lab1.repository.Inventories;
import org.austral.ing.lab1.repository.Products;
import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public class InventoryController {
    private final EntityManagerFactory entityManagerFactory;

    public InventoryController(EntityManagerFactory entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

    public void init() {
        // Route to get the categories of the inventory of a house
        Spark.get("/houses/:houseId/inventory", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Houses houses = new Houses(entityManager);
            try {
                final String houseId = req.params("houseId");
                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                final Optional<House> houseOptional = houses.findById(Long.valueOf(houseId));
                tx.commit();

                if (houseOptional.isEmpty()) {
                    resp.status(404);
                    return "House not exists";
                }

                final House house = houseOptional.get();
                final Inventory inventory = house.getInventario();
                String categories = inventory.getCategoriesAsJson();

                resp.type("application/json");
                return categories;
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while getting the inventory, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to add stock of a product to the inventory of a house
        Spark.post("/houses/:houseId/inventory", "application/json", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Houses houses = new Houses(entityManager);
            Products products = new Products(entityManager);
            Inventories inventories = new Inventories(entityManager);
            try {
                final String houseId = req.params("houseId");
                JsonObject jsonObject = new Gson().fromJson(req.body(), JsonObject.class);
                final String productId = jsonObject.get("productId").getAsString();
                final long quantity = jsonObject.get("quantity").getAsLong();
                final String expirationString = jsonObject.get("expiration").getAsString();
                final long lowStockIndicator = jsonObject.get("lowStockIndicator").getAsLong();

                SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
                Date expiration = formatter.parse(expirationString);

                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                final Optional<House> houseOptional = houses.findById(Long.valueOf(houseId));
                final Optional<Product> productOptional = products.findById(Long.valueOf(productId));

                if (houseOptional.isEmpty()) {
                    resp.status(404);
                    return "House not found";
                }

                if (productOptional.isEmpty()) {
                    resp.status(404);
                    return "Product not found";
                }

                inventories.addStockToHouse(houseOptional.get(), productOptional.get(), quantity, expiration, lowStockIndicator);
                tx.commit();

                resp.status(200);
                return "Everything works fine";
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while updating the inventory, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to reduce stock of a product from the inventory of a house
        Spark.post("/houses/:houseId/inventory", "application/json", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Inventories inventoriesRepo = new Inventories(entityManager);
            try {
                Long houseId = Long.parseLong(req.params("houseId"));
                JsonObject jsonObject = new Gson().fromJson(req.body(), JsonObject.class);
                Long productId = jsonObject.get("productId").getAsLong();
                Long quantity = jsonObject.get("quantity").getAsLong();

                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                inventoriesRepo.reduceStock(houseId, productId, quantity);
                tx.commit();

                resp.status(200);
                return "Stock reduced successfully";
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while reducing the stock, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to get the products of a category from the inventory of a house
        Spark.get("/houses/:houseId/products/:category", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Inventories inventoriesRepo = new Inventories(entityManager);
            try {
                Long houseId = Long.parseLong(req.params("houseId"));
                String category = req.params("category");

                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                List<ProductInfo> products = inventoriesRepo.getProductsByCategory(houseId, category);
                tx.commit();

                if (products != null) {
                    resp.status(200);
                    resp.type("application/json");
                    return new Gson().toJson(products);
                } else {
                    resp.status(404);
                    return "House not found";
                }
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while getting the products, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to get the products low on stock from the inventory of a house
        Spark.get("/houses/:houseId/lowOnStock", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Inventories inventoriesRepo = new Inventories(entityManager);
            try {
                Long houseId = Long.parseLong(req.params("houseId"));

                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                List<ProductInfo> products = inventoriesRepo.getLowOnStockProducts(houseId);
                tx.commit();

                if (products != null) {
                    resp.status(200);
                    resp.type("application/json");
                    return new Gson().toJson(products);
                } else {
                    resp.status(404);
                    return "House not found";
                }
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while getting the products, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to add stock of a low on stock product to the inventory of a house
        // (Adds it to the one with the farthest expiration date)
        Spark.post("/houses/:houseId/addLowStock", "application/json", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Inventories inventoriesRepo = new Inventories(entityManager);
            try {
                Long houseId = Long.parseLong(req.params("houseId"));
                JsonObject jsonObject = new Gson().fromJson(req.body(), JsonObject.class);
                Long productId = jsonObject.get("productId").getAsLong();
                Long quantity = jsonObject.get("quantity").getAsLong();

                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                inventoriesRepo.quickStockAdding(houseId, productId, quantity);
                tx.commit();

                resp.status(200);
                return "Stock added successfully";
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while adding the stock, please try again";
            } finally {
                entityManager.close();
            }
        });
    }
}