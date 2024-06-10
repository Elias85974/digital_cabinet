package org.austral.ing.lab1.repository;

import org.austral.ing.lab1.model.WishList;

import javax.persistence.EntityManager;

public class WishLists {
  private final EntityManager entityManager;
  public WishLists(EntityManager entityManager) {
    this.entityManager = entityManager;
  }
  public void persist(WishList wishList) {
    entityManager.persist(wishList);
  }
}
