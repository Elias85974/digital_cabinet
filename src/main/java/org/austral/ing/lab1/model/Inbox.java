package org.austral.ing.lab1.model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@Table(name = "INBOX")
public class Inbox {
  @Id
  @GeneratedValue(generator = "increment")
  @GenericGenerator(name = "increment", strategy = "increment")
  private Long inbox_Id;

  @ManyToOne
  @JoinColumn(name = "USUARIO_ID")
  private User user;

  @ManyToOne
  @JoinColumn(name = "CASA_ID")
  private House house;

  // getters and setters
  public Long getId() {
    return inbox_Id;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public House getHouse() {
    return house;
  }

  public void setHouse(House house) {
    this.house = house;
  }
}