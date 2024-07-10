package org.austral.ing.lab1.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.austral.ing.lab1.model.inventory.product.Category;
import org.austral.ing.lab1.repository.inventories.products.Categories;
import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;

public class CategoryController {
    private final EntityManagerFactory entityManagerFactory;

    public CategoryController(EntityManagerFactory entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

    public void init() {

        // Route to get all the categories from the database
        Spark.get("/categories", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Categories categoriesRepo = new Categories(entityManager);
            try {
                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
                String categoriesJson = gson.toJson(categoriesRepo.listAll());
                tx.commit();
                resp.type("application/json");
                return categoriesJson;
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while getting the categories, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to create a new category
        Spark.put("/categories", "application/json", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Categories categoriesRepo = new Categories(entityManager);
            try {
                final Category category = Category.fromJson(req.body());
                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                categoriesRepo.persist(category);
                resp.type("application/json");
                resp.status(201);
                tx.commit();
                return category.asJson();
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while creating the category, please try again";
            } finally {
                entityManager.close();
            }
        });

                /* Route to get a category by name
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

         */

        Spark.put("/categories/:name", "application/json", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Categories categoriesRepo = new Categories(entityManager);
            try {
                final String name = req.params("name");
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
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while updating the category, please try again";
            } finally {
                entityManager.close();
            }
        });

        Spark.delete("/categories/:name", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Categories categoriesRepo = new Categories(entityManager);
            try {
                final String name = req.params("name");
                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                categoriesRepo.delete(name);
                tx.commit();
                resp.status(204);
                return "Category deleted";
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while deleting the category, please try again";
            } finally {
                entityManager.close();
            }
        });
    }
}