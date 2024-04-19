package org.austral.ing.lab1.repository;

import org.austral.ing.lab1.model.Inventory;

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
}
