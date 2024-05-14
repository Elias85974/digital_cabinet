package org.austral.ing.lab1.repository;

import org.austral.ing.lab1.model.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class Inventories {
    private final EntityManager entityManager;

    public Inventories(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Optional<Inventory> getFromId(Long id) {
        return Optional.ofNullable(entityManager.find(Inventory.class, id));
    }

    public Inventory persist(Inventory inventory) {
        entityManager.persist(inventory);
        return inventory;
    }

    public void addStockToHouse(House house, Stock stock) {
        LivesIns livesIns = new LivesIns(entityManager);

        // Add the new stock to the house's inventory
        house.getInventario().addStock(stock);

        // Update all LivesIn relationships linked to the house
        for (LivesIn livesIn : livesIns.getFromHouseId(house.getCasa_ID())) {
            livesIn.setCasa(house);
            entityManager.persist(livesIn);
        }

        // Merge and persist the changes
        house = entityManager.merge(house);
        entityManager.persist(house);
    }
}
