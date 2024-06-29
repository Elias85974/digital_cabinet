package org.austral.ing.lab1.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.austral.ing.lab1.model.Category;
import org.austral.ing.lab1.model.Product;
import org.austral.ing.lab1.repository.Categories;
import org.austral.ing.lab1.repository.Products;
import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import java.util.Optional;

public class ProductController {
    private final EntityManagerFactory entityManagerFactory;

    public ProductController(EntityManagerFactory entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

    public void init() {
        // Route to get all the products of the database
        Spark.get("/products", (req, resp) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            Products productsRepo = new Products(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
            String productsJson = gson.toJson(productsRepo.listAll());
            tx.commit();
            entityManager.close();

            resp.type("application/json");
            return productsJson;
        });

        // Route to create a product
        Spark.post("/products/:categoryId", "application/json", (req, resp) -> {
            try {
                final Long categoryId = Long.valueOf(req.params("categoryId"));
                final EntityManager entityManager = entityManagerFactory.createEntityManager();
                Products productsRepo = new Products(entityManager);
                Categories categoriesRepo = new Categories(entityManager);
                final Product product = Product.fromJson(req.body());
                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                Optional<Category> categoryOptional = categoriesRepo.findById(categoryId);
                product.setCategory(categoryOptional.get());
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
    }
}
