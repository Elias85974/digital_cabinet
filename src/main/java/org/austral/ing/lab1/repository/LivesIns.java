package org.austral.ing.lab1.repository;

import org.austral.ing.lab1.model.LivesIn;

import javax.persistence.EntityManager;

public class LivesIns {
    private final EntityManager entityManager;

    public LivesIns(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public LivesIn persist(LivesIn livesIn) {
        entityManager.persist(livesIn);
        return livesIn;
    }
}
