package org.austral.ing.lab1.repository;

import org.austral.ing.lab1.model.House;
import org.austral.ing.lab1.model.Inbox;
import org.austral.ing.lab1.model.User;

import javax.persistence.EntityManager;
import java.util.List;

public class Inboxes {
  private final EntityManager entityManager;

  public Inboxes(EntityManager entityManager) {
    this.entityManager = entityManager;
  }

  public void persist(Inbox inbox) {
    entityManager.persist(inbox);
  }

  public List<Long> getHousesByUserId(Long userId) {
    return entityManager.createQuery("SELECT i.house.id FROM Inbox i WHERE i.user.id = :userId", Long.class)
        .setParameter("userId", userId)
        .getResultList();
  }

  public Inbox findByUserAndHouse(User user, House house) {
    return entityManager.createQuery("SELECT i FROM Inbox i WHERE i.user.id = :userId AND i.house.id = :houseId", Inbox.class)
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
