package org.austral.ing.lab1.repository.inboxes;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Notifications {
    private final EntityManager entityManager;

    public Notifications(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Map<String, Long> getNotificationCounts(Long userId) {
        NearExpirations nearExpirations = new NearExpirations(entityManager);
        Map<String, Long> counts = new HashMap<>();

        // List of all notification types
        List<String> notificationTypes = Arrays.asList("ChatNotification", "HouseInvitation");

        for (String notificationType : notificationTypes) {
            Query query = entityManager.createQuery("SELECT COUNT(n) FROM " + notificationType + " n WHERE n.inbox_user.id = :userId");
            query.setParameter("userId", userId);
            Long count = (Long) query.getSingleResult();
            String jsonNotification = notificationType.substring(0, 1).toLowerCase() + notificationType.substring(1);
            counts.put(jsonNotification + "Size", count);
        }

        counts.put("expirationNotificationSize", (long) nearExpirations.getExpiringStocks(userId).size());
        counts.put("totalSize", counts.values().stream().reduce(0L, Long::sum));

        return counts;
    }
}