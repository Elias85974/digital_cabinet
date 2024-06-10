package org.austral.ing.lab1.repository;

import org.austral.ing.lab1.model.*;

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
        Inventory inventario = house.getInventario();
        inventario.addStock(stock);
        stock.setInventario(inventario);
        entityManager.persist(stock);
        entityManager.persist(inventario);
        entityManager.persist(house);
        /*
        // Update all LivesIn relationships linked to the house
        List<LivesIn> livesInsOfHouse = livesIns.getFromHouseId(house.getCasa_ID());
        for (LivesIn livesIn : livesInsOfHouse) {
            // Merge the LivesIn entity to persist the changes
            entityManager.merge(livesIn);
        }

         */
    }
}
