package org.austral.ing.lab1.repository.inventories.products;

import org.austral.ing.lab1.model.inventory.product.BarCode;
import org.austral.ing.lab1.model.inventory.product.Product;

import javax.persistence.EntityManager;

public class Barcodes {
    private final EntityManager entityManager;

    public Barcodes(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Product getProduct(String barcode) {
        return entityManager
                .createQuery("SELECT b.product FROM BarCode b WHERE b.barCode LIKE :barcode", Product.class)
                .setParameter("barcode", barcode).getResultList()
                .stream()
                .findFirst()
                .orElse(null);
    }

    public void createBarcode(Product product, String barcode) {
        BarCode newBarCode = new BarCode(product, barcode);
        entityManager.persist(newBarCode);
    }
}
