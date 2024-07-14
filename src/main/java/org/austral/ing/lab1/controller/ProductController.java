package org.austral.ing.lab1.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.austral.ing.lab1.model.inventory.product.Category;
import org.austral.ing.lab1.model.inventory.product.Product;
import org.austral.ing.lab1.repository.inventories.products.Categories;
import org.austral.ing.lab1.repository.inventories.products.Products;
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
        // Route to get all the products from the database
        Spark.get("/products", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Products productsRepo = new Products(entityManager);
            try {
                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
                String productsJson = gson.toJson(productsRepo.listAll());
                tx.commit();
                resp.type("application/json");
                return productsJson;
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while getting the products, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to create a product and link it with the needed category
        Spark.put("/products/:categoryId", "application/json", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Products productsRepo = new Products(entityManager);
            Categories categoriesRepo = new Categories(entityManager);
            try {
                final Long categoryId = Long.valueOf(req.params("categoryId"));
                final Product product = Product.fromJson(req.body());
                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                Optional<Category> categoryOptional = categoriesRepo.findById(categoryId);
                if (categoryOptional.isEmpty()) {
                    resp.status(404);
                    return "Category not found to create your product";
                }
                productsRepo.createProduct(product, categoryOptional.get());
                resp.type("application/json");
                resp.status(201);
                tx.commit();
                return "Product created";
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while creating the product, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to get a product by the name
        Spark.get("/products/:name", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Products productsRepo = new Products(entityManager);
            try {
                final String name = req.params("name");
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
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while getting the product, please try again";
            } finally {
                entityManager.close();
            }
        });

        /* Our ABM logic of product does not support product modifications so the methods below are not used */

        // Route to change the data of a product
        Spark.put("/products/:name", "application/json", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Products productsRepo = new Products(entityManager);
            try {
                final String name = req.params("name");
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
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while updating the product, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to delete a product by the name
        Spark.delete("/products/:name", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Products productsRepo = new Products(entityManager);
            try {
                final String name = req.params("name");
                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                productsRepo.delete(name);
                tx.commit();

                resp.status(204);
                return "Product deleted";
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while deleting the product, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to get all the unverified products
        Spark.get("/products/unverified", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Products productsRepo = new Products(entityManager);
            try {
                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
                String productsJson = gson.toJson(productsRepo.findUnverifiedProducts());
                tx.commit();
                resp.type("application/json");
                return productsJson;
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while getting the unverified products, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to verify a product
        Spark.put("/products/:productId/verify", "application/json", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Products productsRepo = new Products(entityManager);
            try {
                final Long productId = Long.valueOf(req.params("productId"));
                final boolean isVerified = Boolean.parseBoolean(req.body());
                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                productsRepo.verifyProduct(productId, isVerified);
                tx.commit();
                resp.status(200);
                return "Product verification status updated";
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while updating the product verification status, please try again";
            } finally {
                entityManager.close();
            }
        });
    }
}