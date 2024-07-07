package org.austral.ing.lab1.repository.inventories;

import javax.persistence.EntityManager;
import org.austral.ing.lab1.model.inventory.Stock;

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

}
