package org.austral.ing.lab1.controller;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.austral.ing.lab1.model.Category;
import org.austral.ing.lab1.repository.Categories;
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
        // Route to get the existing categories
        Spark.get("/categories", (req, resp) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            Categories categoriesRepo = new Categories(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
            String categoriesJson = gson.toJson(categoriesRepo.listAll());
            tx.commit();
            entityManager.close();

            resp.type("application/json");
            return categoriesJson;
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
}
