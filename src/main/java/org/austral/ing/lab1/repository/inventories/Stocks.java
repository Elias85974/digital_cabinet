package org.austral.ing.lab1.repository.inventories;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;

import org.austral.ing.lab1.model.inventory.Stock;
import org.austral.ing.lab1.model.inventory.product.Product;

import java.util.List;
import java.util.Optional;

public class Stocks {
    private final EntityManager entityManager;

    public Stocks(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Optional<Stock> findById(Long id) {
        return entityManager.createQuery("SELECT s FROM Stock s WHERE s.id = :id", Stock.class)
                .setParameter("id", id).getResultList()
                .stream()
                .findFirst();
    }

    public List<Stock> listAll() {
        return entityManager.createQuery("SELECT s FROM Stock s", Stock.class).getResultList();
    }

    public Stock persist(Stock stock) {
        entityManager.persist(stock);
        return stock;
    }

    public Long getLowStockIndicator(Long houseId, Product possibleProduct) {
        try {
            return (Long) entityManager.createQuery("SELECT s.lowStockIndicator FROM Stock s WHERE s.inventario.inventario_ID = :houseId AND s.product = :product")
                .setParameter("houseId", houseId)
                .setParameter("product", possibleProduct)
                .getSingleResult();
        }
        catch (NoResultException e) {
            return 0L;
        }
    }
}
