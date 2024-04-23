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

    public List<Category> findByName(String name) {
        return entityManager
                .createQuery("SELECT c FROM Category c WHERE c.nombre LIKE :name", Category.class)
                .setParameter("name", name).getResultList();
    }

    public Optional<Category> findById(Long id) {
        return Optional.ofNullable(entityManager.find(Category.class, id));
    }

    public List<Category> listAll() {
        return entityManager.createQuery("SELECT c FROM Category c", Category.class).getResultList();
    }

    public void delete(String name) {
        Category categoryOptional = findByName(name).get(0);

        if (categoryOptional != null) {
            entityManager.remove(categoryOptional);
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
        Category categoryOptional = findByName(name).get(0);

        if (categoryOptional == null) {
            return null;
        }



        // Here you can set the new values for the category fields
        categoryOptional.setNombre(newCategoryData.getNombre());

        entityManager.merge(categoryOptional);

        return categoryOptional;
    }


    public void updatePartialCategory(String name, Category newCategoryData) {
        Category categoryOptional = findByName(name).get(0);

        if (categoryOptional != null) {


            if (newCategoryData.getNombre() != null) {
                categoryOptional.setNombre(newCategoryData.getNombre());
            }

            entityManager.merge(categoryOptional);
        }
    }

}