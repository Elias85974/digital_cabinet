package org.austral.ing.lab1.repository.chats;

import javax.persistence.EntityManager;

public class Chats {
    private final EntityManager entityManager;

    public Chats(EntityManager entityManager) {
        this.entityManager = entityManager;
    }
}
