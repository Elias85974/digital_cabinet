package org.austral.ing.lab1.repository.inboxes;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Map;

public class ChatNotifications {
    private final EntityManager entityManager;

    public ChatNotifications(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public List<Map<String, Object>> getChatNotifications(Long userId) {
        return null;
    }
}
