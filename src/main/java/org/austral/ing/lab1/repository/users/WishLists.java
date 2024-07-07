package org.austral.ing.lab1.repository.users;

import org.austral.ing.lab1.model.user.WishList;

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
