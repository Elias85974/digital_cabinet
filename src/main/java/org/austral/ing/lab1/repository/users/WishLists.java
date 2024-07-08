package org.austral.ing.lab1.repository.users;

import org.austral.ing.lab1.model.user.WishList;

import javax.persistence.EntityManager;
import java.util.List;

public class WishLists {
  private final EntityManager entityManager;
  public WishLists(EntityManager entityManager) {
    this.entityManager = entityManager;
  }
  public void persist(WishList wishList) {
    entityManager.persist(wishList);
  }

  public void removeProductsFromWishList(Long userId, List<String> productNames) {
    entityManager.createQuery("DELETE FROM WishList w WHERE w.usuario.id = :userId AND w.product IN :productNames")
      .setParameter("userId", userId)
      .setParameter("productNames", productNames)
      .executeUpdate();
  }
}
