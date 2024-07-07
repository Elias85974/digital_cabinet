package org.austral.ing.lab1.repository.inboxes;

import org.austral.ing.lab1.model.house.House;
import org.austral.ing.lab1.model.user.User;
import org.austral.ing.lab1.model.notification.HouseInvitation;

import javax.persistence.EntityManager;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class HouseInvitations {
    private final EntityManager entityManager;

    public HouseInvitations(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public List<Map<String, Object>> getHousesByUserId(Long userId) {
        // Getting the notifications that the user has
        List<HouseInvitation> notifications = entityManager.createQuery("SELECT n FROM HouseInvitation n WHERE n.inbox_user.usuario_ID = :userId", HouseInvitation.class)
                .setParameter("userId", userId)
                .getResultList();

        // Convert notifications to a list of maps
        return notifications.stream()
                .map(notification -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("username", notification.getInbox_user().getNombre());
                    map.put("houseId", notification.getHouse().getCasa_ID());
                    return map;
                })
                .collect(Collectors.toList());
    }

    public HouseInvitation findByUserAndHouse(User user, House house) {
        return entityManager.createQuery("SELECT n FROM HouseInvitation n WHERE n.inbox_user.usuario_ID = :userId AND n.house.id = :houseId", HouseInvitation.class)
                .setParameter("userId", user.getUsuario_ID())
                .setParameter("houseId", house.getCasa_ID())
                .getResultList()
                .stream()
                .findFirst()
                .orElse(null);
    }

    public void delete(HouseInvitation houseInvitation) {
        entityManager.remove(houseInvitation);
    }
}
