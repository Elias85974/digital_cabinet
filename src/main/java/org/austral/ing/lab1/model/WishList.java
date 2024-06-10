package org.austral.ing.lab1.model;


import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@Table(name = "INVENTORY")
public class WishList {
  @Id
  @GeneratedValue(generator = "increment")
  @GenericGenerator(name = "increment", strategy = "increment")
  private Long wishListId;

  @OneToOne
  @JoinColumn(name = "USUARIO_ID")
  private User usuario;
  
  /*@ManyToMany
  @JoinColumn(name = "PRODUCTO_ID")
  private SpecialSet<Product> products;
  */
}
