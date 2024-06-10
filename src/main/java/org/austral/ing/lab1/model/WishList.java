package org.austral.ing.lab1.model;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "WISHLIST")
public class WishList {
  @Id
  @GeneratedValue(generator = "increment")
  @GenericGenerator(name = "increment", strategy = "increment")
  private Long wishList_Id;

  @OneToOne
  @JoinColumn(name = "USUARIO_ID")
  private User user;

  @ManyToMany
  @JoinTable(
      name = "WISHLIST_PRODUCT",
      joinColumns = @JoinColumn(name = "WISHLIST_ID"),
      inverseJoinColumns = @JoinColumn(name = "PRODUCTO_ID")
  )
  private List<Product> products;

  // getters and setters

  public Long getId() {
    return wishList_Id;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public List<Product> getProducts() {
    return products;
  }

  public String asJson() {
    return "{\"id\":" + wishList_Id + ",\"user\":" + user.getUsuario_ID() + ",\"products\":" + products + "}";
  }
}