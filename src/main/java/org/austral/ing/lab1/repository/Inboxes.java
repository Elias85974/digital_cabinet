package org.austral.ing.lab1.repository;

import org.austral.ing.lab1.model.House;
import org.austral.ing.lab1.model.User;
import org.austral.ing.lab1.model.notification.HouseInvitation;
import org.austral.ing.lab1.model.notification.Notification;

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
}