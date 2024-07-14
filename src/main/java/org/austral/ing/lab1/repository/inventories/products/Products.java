package org.austral.ing.lab1.repository.inventories.products;

import org.austral.ing.lab1.model.inventory.product.Category;
import org.austral.ing.lab1.model.inventory.product.Product;

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

    public Optional<Product> findById(Long id) {
        return Optional.ofNullable(entityManager.find(Product.class, id));
    }

    public Optional<Product> findByBrand(String brand) {
        return entityManager
                .createQuery("SELECT p FROM Product p WHERE p.marca LIKE :brand", Product.class)
                .setParameter("brand", brand).getResultList()
                .stream()
                .findFirst();
    }

    public void delete(String name) {
        Optional<Product> productOptional = findByName(name);

        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            entityManager.remove(product);
        }
    }

    public List<Product> listAll() {
        return entityManager.createQuery("SELECT p FROM Product p", Product.class).getResultList();
    }

    public List<Product> listByCategory(String categoryName, int pageNumber, int pageSize) {
        return entityManager
            .createQuery("SELECT p FROM Product p JOIN Category c ON p.category.categoria_ID = c.categoria_ID WHERE c.nombre LIKE :categoryName", Product.class)
            .setParameter("categoryName", categoryName)
            .setFirstResult((pageNumber - 1) * pageSize)
            .setMaxResults(pageSize)
            .getResultList();
    }

    public Product persist(Product product) {
        entityManager.persist(product);
        return product;
    }

    public void createProduct(Product newProduct, Category category) {
        newProduct.setCategory(category);
        entityManager.persist(newProduct);
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
        // product.setCategoria_ID(newProductData.getCategoria_ID()); //deberia ser el nombre de la categoria no el ID

        entityManager.merge(product);

        return product;
    }

    public void updatePartialProduct(String name, Product newProductData) {
        Optional<Product> productOptional = findByName(name);

        if (productOptional.isPresent()) {
            Product product = productOptional.get();

            if (newProductData.getNombre() != null) {
                product.setNombre(newProductData.getNombre());
            }
            if (newProductData.getMarca() != null) {
                product.setMarca(newProductData.getMarca());
            }
            if (newProductData.getTipoDeCantidad() != null) {
                product.setTipoDeCantidad(newProductData.getTipoDeCantidad());
            }
            if (newProductData.getCategoria_ID() != null) {
                // product.setCategoria_ID(newProductData.getCategoria_ID());
            }

            entityManager.merge(product);
        }
    }

    public List<Product> findUnverifiedProducts() {
        return entityManager.createQuery("SELECT p FROM Product p WHERE p.isVerified IS NULL", Product.class).getResultList();
    }

    public void verifyProduct(Long productId, Boolean isVerified) {
        Optional<Product> productOptional = findById(productId);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            product.setIsVerified(isVerified);
            entityManager.merge(product);
        } else {
            throw new IllegalArgumentException("Product with id " + productId + " does not exist.");
        }
    }
}
