package org.austral.ing.lab1.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.austral.ing.lab1.model.house.House;
import org.austral.ing.lab1.model.inventory.Inventory;
import org.austral.ing.lab1.model.inventory.product.Product;
import org.austral.ing.lab1.object.jsonparsable.ProductInfo;
import org.austral.ing.lab1.object.jsonparsable.ProductTotalInfo;
import org.austral.ing.lab1.repository.houses.Houses;
import org.austral.ing.lab1.repository.inventories.Inventories;
import org.austral.ing.lab1.repository.inventories.products.Products;
import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class InventoryController {
    private final Gson gson = new Gson();
    private final EntityManagerFactory entityManagerFactory;
    public InventoryController(EntityManagerFactory entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

    public void init() {
        // Route to get the categories of the inventory of a house
        Spark.get("/houses/:houseId/inventory/categories", (req, resp) -> {
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

        // Route to get the products of a category from the inventory of a house
        Spark.get("/houses/:houseId/inventory/:category/products", (req, resp) -> {
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
                    return gson.toJson(products);
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
        Spark.get("/houses/:houseId/inventory/lowOnStock", (req, resp) -> {
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
                    return gson.toJson(products);
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

        // Route to get the products on stock from the inventory of a house
        Spark.get("/houses/:houseId/inventory/stock", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Inventories inventoriesRepo = new Inventories(entityManager);
            try {
                Long houseId = Long.parseLong(req.params("houseId"));

                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                tx.commit();
                List<ProductTotalInfo> products = inventoriesRepo.getStockProducts(houseId);

                if (products != null) {
                    resp.status(200);
                    resp.type("application/json");
                    return gson.toJson(products);
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

        // Route to add stock of a product to the inventory of a house
        Spark.post("/houses/:houseId/inventory", "application/json", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Houses houses = new Houses(entityManager);
            Products products = new Products(entityManager);
            Inventories inventories = new Inventories(entityManager);
            resp.type("message");
            try {
                final String houseId = req.params("houseId");
                JsonObject jsonObject = new Gson().fromJson(req.body(), JsonObject.class);
                final String productId = jsonObject.get("productId").getAsString();
                final long quantity = jsonObject.get("quantity").getAsLong();
                final String expirationString = jsonObject.get("expiration").getAsString();
                final long lowStockIndicator = jsonObject.get("lowStockIndicator").getAsLong();
                final double price = jsonObject.get("price").getAsDouble();

                SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
                Date expiration = formatter.parse(expirationString);

                EntityTransaction tx = entityManager.getTransaction();
                tx.begin(); // hi there, no tengo copilot :(
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

                inventories.addStockToHouse(houseOptional.get(), productOptional.get(), quantity, expiration, lowStockIndicator, price);
                tx.commit();

                resp.status(200);
                return "The product was added to the inventory successfully";
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while updating the inventory, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to add stock of a low on stock product to the inventory of a house
        // (Adds it to the one with the farthest expiration date)
        Spark.post("/houses/:houseId/inventory/addLowStock", "application/json", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Inventories inventoriesRepo = new Inventories(entityManager);
            resp.type("message");
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

        // Route to reduce stock of a product from the inventory of a house
        Spark.post("/houses/:houseId/inventory/reduceStock", "application/json", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Inventories inventoriesRepo = new Inventories(entityManager);
            try {
                Long houseId = Long.parseLong(req.params("houseId"));
                JsonObject jsonObject = new Gson().fromJson(req.body(), JsonObject.class);
                Long productId = jsonObject.get("productId").getAsLong();
                Long quantity = jsonObject.get("quantity").getAsLong();

                inventoriesRepo.reduceStock(houseId, productId, quantity);

                resp.type("message");
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

        // Route to get the total value of the inventory of a house grouped by category
        Spark.get("/houses/:houseId/inventory/valueByCategory", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Houses houses = new Houses(entityManager);
            Inventories inventories = new Inventories(entityManager);
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

                // Get the total value of the inventory of a house grouped by category
                Map<String, Double> valueByCategory = inventories.getValueByCategory(inventory);

                resp.type("application/json");
                return gson.toJson(valueByCategory);
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while getting the inventory value by category, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to get products filter by category and low stock
        Spark.get("/houses/:houseId/inventory/:category/lowOnStock", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Inventories inventoriesRepo = new Inventories(entityManager);
            try {
                Long houseId = Long.parseLong(req.params("houseId"));
                String category = req.params("category");

                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                List<ProductInfo> products = inventoriesRepo.getLowOnStockProductsByCategory(houseId, category);
                tx.commit();

                if (products != null) {
                    resp.status(200);
                    resp.type("application/json");
                    return gson.toJson(products);
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
    }
}