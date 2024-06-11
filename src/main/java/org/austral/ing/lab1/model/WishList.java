package org.austral.ing.lab1.model;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@Table(name = "WISHLIST")
public class WishList {
  @Id
  @GeneratedValue(generator = "increment")
  @GenericGenerator(name = "increment", strategy = "increment")
  private Long wishList_Id;

  @ManyToOne
  @JoinColumn(name = "USER_ID")
  private User usuario;

  @Column(name = "PRODUCT")
  private String product;

  // getters and setters

  public Long getId() {
    return wishList_Id;
  }

  public User getUsuario() {
    return usuario;
  }

  public void setUsuario(User user) {
    this.usuario = user;
  }

  public String getProduct() {
    return product;
  }

  public String asJson() {
    return "{\"id\":" + wishList_Id + ",\"user\":" + usuario.getUsuario_ID() + ",\"product\":\"" + product + "\"}";
  }

  public void setProduct(String product) {
    this.product = product;
  }
}