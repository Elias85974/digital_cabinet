package org.austral.ing.lab1.repository;

import org.austral.ing.lab1.model.House;
import org.austral.ing.lab1.model.Inbox;
import org.austral.ing.lab1.model.User;

import javax.persistence.EntityManager;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Inboxes {
  private final EntityManager entityManager;

  public Inboxes(EntityManager entityManager) {
    this.entityManager = entityManager;
  }

  public void persist(Inbox inbox) {
    entityManager.persist(inbox);
  }

  public List<Map<String, Object>> getHousesByUserId(Long userId) {
    // Getting the houses that the user has pending requests for
    List<Inbox> inboxes = entityManager.createQuery("SELECT i FROM Inbox i WHERE i.invitedUser.id = :userId AND i.pending = true", Inbox.class)
        .setParameter("userId", userId)
        .getResultList();

    // Convert inboxes to a list of maps
    return inboxes.stream()
        .map(inbox -> {
            Map<String, Object> map = new HashMap<>();
            map.put("username", inbox.getInviterUsername());
            map.put("houseId", inbox.getHouse().getCasa_ID());
            return map;
        })
        .collect(Collectors.toList());
}

  public Inbox findByUserAndHouse(User user, House house) {
    return entityManager.createQuery("SELECT i FROM Inbox i WHERE i.invitedUser.id = :userId AND i.house.id = :houseId", Inbox.class)
        .setParameter("userId", user.getUsuario_ID())
        .setParameter("houseId", house.getCasa_ID())
        .getResultList()
        .stream()
        .findFirst()
        .orElse(null);
  }

  public void delete(Inbox inbox) {
    entityManager.remove(inbox);
  }
}