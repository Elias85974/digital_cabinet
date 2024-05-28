package org.austral.ing.lab1.repository;

import org.austral.ing.lab1.model.livesIn.LivesIn;

import javax.persistence.EntityManager;
import java.util.List;

public class LivesIns {
    private final EntityManager entityManager;

    public LivesIns(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public LivesIn persist(LivesIn livesIn) {
        entityManager.persist(livesIn);
        return livesIn;
    }

    public List<LivesIn> getFromHouseId(Long casa_ID) {
        return entityManager.createQuery("SELECT l FROM LivesIn l WHERE l.casa.casa_ID = :casa_ID", LivesIn.class)
                .setParameter("casa_ID", casa_ID)
                .getResultList();
    }
}
