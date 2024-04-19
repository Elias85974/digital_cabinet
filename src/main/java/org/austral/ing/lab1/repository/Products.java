package org.austral.ing.lab1.repository;

import org.austral.ing.lab1.model.Product;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

public class Products {

    private final EntityManager entityManager;

    public Products(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Optional<Product> findByName(String name) {
        return entityManager
                .createQuery("SELECT p FROM Product p WHERE p.nombre LIKE :name", Product.class)
                .setParameter("name", name).getResultList()
                .stream()
                .findFirst();
    }

    public List<Product> listAll() {
        return entityManager.createQuery("SELECT p FROM Product p", Product.class).getResultList();
    }

    public Product persist(Product product) {
        entityManager.persist(product);
        return product;
    }


    public Product modify(String name, Product newProductData) {
        Optional<Product> productOptional = findByName(name);

        if (productOptional.isEmpty()) {
            return null;
        }

        Product product = productOptional.get();

        // Here you can set the new values for the product fields
        product.setNombre(newProductData.getNombre());
        product.setMarca(newProductData.getMarca());
        product.setTipoDeCantidad(newProductData.getTipoDeCantidad());
        product.setCategoria_ID(newProductData.getCategoria_ID()); //deberia ser el nombre de la categoria no el ID

        entityManager.merge(product);

        return product;
    }

}
