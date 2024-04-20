package org.austral.ing.lab1;

import com.google.common.base.Strings;
import com.google.gson.Gson;
import org.austral.ing.lab1.model.*;
import org.austral.ing.lab1.repository.*;
import org.austral.ing.lab1.model.Product;
import org.austral.ing.lab1.repository.Products;
import org.austral.ing.lab1.model.Category;
import org.austral.ing.lab1.repository.Categories;

import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import java.util.Optional;

public class Application {

    private static final Gson gson = new Gson();

    public static void main(String[] args) {

        final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("lab1");

        Spark.port(4321);

        // Commenting the lines of testing methods
        // storedBasicUser(entityManagerFactory);
        makeAnUserLiveInAHouse(entityManagerFactory);

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


        // Route to create a product
        Spark.post("/products", "application/json", (req, resp) -> {
            try {
                final EntityManager entityManager = entityManagerFactory.createEntityManager();
                Products productsRepo = new Products(entityManager);
                final Product product = Product.fromJson(req.body());

                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                productsRepo.persist(product);
                resp.type("application/json");
                resp.status(201);
                tx.commit();

                return product.asJson();
            } catch (Exception e) {
                resp.status(500);
                return "An error occurred while creating the product, please try again";
            }
        });

        // Route to get a product by name
        Spark.get("/products/:name", (req, resp) -> {
            final String name = req.params("name");

            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            Products productsRepo = new Products(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            Optional<Product> productOptional = productsRepo.findByName(name);
            tx.commit();

            if (productOptional.isPresent()) {
                resp.type("application/json");
                return productOptional.get().asJson();
            } else {
                resp.status(404);
                return "Product not found";
            }
        });

        // Route to update a product
        Spark.put("/products/:name", "application/json", (req, resp) -> {
            final String name = req.params("name");
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            Products productsRepo = new Products(entityManager);
            final Product newProductData = Product.fromJson(req.body());

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            Product updatedProduct = productsRepo.modify(name, newProductData);
            tx.commit();

            if (updatedProduct != null) {
                resp.type("application/json");
                return updatedProduct.asJson();
            } else {
                resp.status(404);
                return "Product not found";
            }
        });

        // Route to delete a product
        Spark.delete("/products/:name", (req, resp) -> {
            try {
                final String name = req.params("name");
                final EntityManager entityManager = entityManagerFactory.createEntityManager();
                Products productsRepo = new Products(entityManager);

                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                productsRepo.delete(name);
                tx.commit();

                resp.status(204);
                return "Product deleted";
            } catch (Exception e) {
                resp.status(500);
                return "An error occurred while deleting the product, please try again";
            }
        });


        // Route to create a category
        Spark.post("/categories", "application/json", (req, resp) -> {
            try {
                final Category category = Category.fromJson(req.body());
                final EntityManager entityManager = entityManagerFactory.createEntityManager();
                Categories categoriesRepo = new Categories(entityManager);

                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                categoriesRepo.persist(category);
                resp.type("application/json");
                resp.status(201);
                tx.commit();

                return category.asJson();
            } catch (Exception e) {
                resp.status(500);
                return "An error occurred while creating the category";
            }
        });

        // Route to get a category by name
        Spark.get("/categories/:name", (req, resp) -> {
            final String name = req.params("name");
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            Categories categoriesRepo = new Categories(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            Optional<Category> categoryOptional = categoriesRepo.findByName(name);
            tx.commit();

            if (categoryOptional.isPresent()) {
                resp.type("application/json");
                return categoryOptional.get().asJson();
            } else {
                resp.status(404);
                return "Category not found";
            }
        });

        // Route to update a category
        Spark.put("/categories/:name", "application/json", (req, resp) -> {
            final String name = req.params("name");
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            Categories categoriesRepo = new Categories(entityManager);
            final Category newCategoryData = Category.fromJson(req.body());

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            Category updatedCategory = categoriesRepo.modify(name, newCategoryData);
            tx.commit();

            if (updatedCategory != null) {
                resp.type("application/json");
                return updatedCategory.asJson();
            } else {
                resp.status(404);
                return "Category not found";
            }
        });

        // Route to delete a category
        Spark.delete("/categories/:name", (req, resp) -> {
            final String name = req.params("name");
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            Categories categoriesRepo = new Categories(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            categoriesRepo.delete(name);
            tx.commit();

            resp.status(204);
            return "Category deleted";
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

    // This method creates a user, a house and a relationship between them, this was made for testing purposes
    private static void makeAnUserLiveInAHouse(EntityManagerFactory entityManagerFactory) {
        final EntityManager entityManager = entityManagerFactory.createEntityManager();
        final Users users = new Users(entityManager);
        final Inventories inventories = new Inventories(entityManager);

        EntityTransaction tx = entityManager.getTransaction();
        tx.begin();
        final User luke = User.create("lol").setFirstName("Luke").setLastName("SkyWalker").setPassword("123456").build();
        final Inventory inventory = new Inventory(); // Create Inventory instance
        final House house = House.create(inventory).withDireccion("Calle Falsa 123").withNombre("Casa de Luke").build();
        inventory.setCasa(house); // Set House instance
        inventories.persist(inventory); // Save Inventory instance
        final LivesIn livesIn = LivesIn.create(luke, house, true).build();
        entityManager.persist(luke);
        entityManager.persist(house);
        entityManager.persist(livesIn);
        tx.commit();
        entityManager.refresh(luke); // Refresh the User entity
        entityManager.close();
        System.out.println(luke.getLivesIns().get(0).getCasa().getDireccion());
        System.out.println(luke.getLivesIns().get(0).getCasa().getInventario_ID());
    }

    private static String capitalized(String name) {
        return Strings.isNullOrEmpty(name) ? name : name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
    }



}
