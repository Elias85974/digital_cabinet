package org.austral.ing.lab1.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.austral.ing.lab1.model.House;
import org.austral.ing.lab1.model.Inventory;
import org.austral.ing.lab1.model.Product;
import org.austral.ing.lab1.model.Stock;
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
        // Requesting an inventory of a house
        Spark.get("/houses/:houseId/inventory", (req, resp) -> {
            final String houseId = req.params("houseId");

            /* Begin Business Logic */
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Houses houses = new Houses(entityManager);
            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            final Optional<House> houseOptional = houses.findById(Long.valueOf(houseId));
            tx.commit();
            entityManager.close();
            /* End Business Logic */

            if (houseOptional.isEmpty()) {
                resp.status(404);
                return "House not exists";
            }

            final House house = houseOptional.get();
            final Inventory inventory = house.getInventario();
            String categories = inventory.getCategoriesAsJson();

            resp.type("application/json");
            return categories;
        });

        // Route to update the inventory of a given house
        Spark.post("/houses/:houseId/inventory", "application/json", (req, resp) -> {
            final String houseId = req.params("houseId");

            // Parse the JSON body of the request
            JsonObject jsonObject = new Gson().fromJson(req.body(), JsonObject.class);
            final String productId = jsonObject.get("productId").getAsString();
            final long quantity = jsonObject.get("quantity").getAsLong();
            final String expirationString = jsonObject.get("expiration").getAsString();
            final long lowStockIndicator = jsonObject.get("lowStockIndicator").getAsLong();

            // Parse the expiration string into a java.util.Date object
            SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
            Date expiration = formatter.parse(expirationString);

            /* Begin Business Logic */
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Houses houses = new Houses(entityManager);
            final Products products = new Products(entityManager);
            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            final Optional<House> houseOptional = houses.findById(Long.valueOf(houseId));
            final Optional<Product> productOptional = products.findById(Long.valueOf(productId));

            /* End Business Logic */

            if (houseOptional.isEmpty()) {
                resp.status(404);
                return "House not found";
            }

            if (productOptional.isEmpty()) {
                resp.status(404);
                return "Product not found";
            }

            final House house = houseOptional.get();
            Product product = productOptional.get();
            final Stock stock = Stock.create(quantity).setProduct(product).setExpiration(expiration)
                    .setLowStockIndicator(lowStockIndicator).build();

            /* Begin Business Logic */
            final Inventories inventories = new Inventories(entityManager);
            entityManager.persist(stock);
            inventories.addStockToHouse(house, stock);
            tx.commit();
            entityManager.close();
            /* End Business Logic */
            resp.status(200);
            return "Everything works fine";
        });

        // Route to reduce the stock of an already existing product in the given house
        Spark.post("/houses/:houseId/inventory", "application/json", (req, resp) -> {
            Long houseId = Long.parseLong(req.params("houseId"));

            // Parse the JSON body of the request
            JsonObject jsonObject = new Gson().fromJson(req.body(), JsonObject.class);
            Long productId = jsonObject.get("productId").getAsLong();
            Long quantity = jsonObject.get("quantity").getAsLong();

            Inventories inventoriesRepo = new Inventories(entityManagerFactory.createEntityManager());

            // Call the method to reduce stock
            inventoriesRepo.reduceStock(houseId, productId, quantity);

            resp.status(200);
            return "Stock reduced successfully";
        });

        // Route to get the filtered by categories products of a house
        Spark.get("/houses/:houseId/products/:category", (req, resp) -> {
            Long houseId = Long.parseLong(req.params("houseId"));
            String category = req.params("category");

            // Begin Business Logic
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Inventories inventoriesRepo = new Inventories(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();

            List<ProductInfo> products = inventoriesRepo.getProductsByCategory(houseId, category);

            tx.commit();
            entityManager.close();

            if (products != null) {
                resp.status(200);
                resp.type("application/json");
                return new Gson().toJson(products);
            } else {
                resp.status(404);
                return "House not found";
            }
        });

        // Route to get the products low on stock of a house
        Spark.get("/houses/:houseId/lowOnStock", (req, resp) -> {
            Long houseId = Long.parseLong(req.params("houseId"));

            // Begin Business Logic
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Inventories inventoriesRepo = new Inventories(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();

            List<ProductInfo> products = inventoriesRepo.getLowOnStockProducts(houseId);

            tx.commit();
            entityManager.close();

            if (products != null) {
                resp.status(200);
                resp.type("application/json");
                return new Gson().toJson(products);
            } else {
                resp.status(404);
                return "House not found";
            }
        });

        // Route to add stock to the last stock of a product
        Spark.post("/houses/:houseId/addLowStock", "application/json", (req, resp) -> {
            Long houseId = Long.parseLong(req.params("houseId"));

            // Parse the JSON body of the request
            JsonObject jsonObject = new Gson().fromJson(req.body(), JsonObject.class);
            Long productId = jsonObject.get("productId").getAsLong();
            Long quantity = jsonObject.get("quantity").getAsLong();

            // Begin Business Logic
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Inventories inventoriesRepo = new Inventories(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();

            // Call the method to add stock
            inventoriesRepo.addStock(houseId, productId, quantity);

            tx.commit();
            entityManager.close();

            resp.status(200);
            return "Stock added successfully";
        });
    }
}
