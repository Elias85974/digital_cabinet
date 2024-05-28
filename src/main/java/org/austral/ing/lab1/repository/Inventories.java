package org.austral.ing.lab1.repository;

import org.austral.ing.lab1.model.*;
import org.austral.ing.lab1.model.livesIn.LivesIn;

import javax.persistence.EntityManager;
import java.util.Optional;

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
        // Reattach the house entity to the persistence context
        house = entityManager.merge(house);
        // Update all LivesIn relationships linked to the house
        for (LivesIn livesIn : livesIns.getFromHouseId(house.getCasa_ID())) {
            livesIn.setCasa(house);
            // Now you can persist the LivesIn entity
            entityManager.persist(livesIn);
        }

        // Merge and persist the changes
        house = entityManager.merge(house);
        entityManager.persist(house);
    }
}
