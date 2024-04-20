package org.austral.ing.lab1.repository;

import org.austral.ing.lab1.model.House;

import javax.persistence.EntityManager;
import java.util.Optional;

public class Houses {
    private final EntityManager entityManager;

    public Houses(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Optional<House> findById(Long id) {
        return entityManager.createQuery("SELECT h FROM House h WHERE h.casa_ID = :id", House.class)
                .setParameter("id", id).getResultList()
                .stream()
                .findFirst();
    }

    public House persist(House house) {
        entityManager.persist(house);
        return house;
    }
}
