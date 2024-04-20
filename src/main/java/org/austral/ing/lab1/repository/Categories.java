package org.austral.ing.lab1.repository;

import org.austral.ing.lab1.model.Category;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

public class Categories {

    private final EntityManager entityManager;

    public Categories(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Optional<Category> findByName(String name) {
        return entityManager
                .createQuery("SELECT c FROM Category c WHERE c.nombre LIKE :name", Category.class)
                .setParameter("name", name).getResultList()
                .stream()
                .findFirst();
    }

    public void delete(String name) {
        Optional<Category> categoryOptional = findByName(name);

        if (categoryOptional.isPresent()) {
            Category category = categoryOptional.get();
            entityManager.remove(category);
        }
    }

    public List<Category> listAll(int pageNumber, int pageSize, String sortField) {
        return entityManager.createQuery("SELECT c FROM Category c", Category.class).getResultList();
    }

    public Category persist(Category category) {
        entityManager.persist(category);
        return category;
    }

    public void addCategory(Category newCategory) {
        entityManager.persist(newCategory);
    }

    public Category modify(String name, Category newCategoryData) {
        Optional<Category> categoryOptional = findByName(name);

        if (categoryOptional.isEmpty()) {
            return null;
        }

        Category category = categoryOptional.get();

        // Here you can set the new values for the category fields
        category.setNombre(newCategoryData.getNombre());
        category.setCantTotal(newCategoryData.getCantTotal());

        entityManager.merge(category);

        return category;
    }


    public void updatePartialCategory(String name, Category newCategoryData) {
        Optional<Category> categoryOptional = findByName(name);

        if (categoryOptional.isPresent()) {
            Category category = categoryOptional.get();

            if (newCategoryData.getNombre() != null) {
                category.setNombre(newCategoryData.getNombre());
            }
            if (newCategoryData.getCantTotal() != null) {
                category.setCantTotal(newCategoryData.getCantTotal());
            }

            entityManager.merge(category);
        }
    }

}