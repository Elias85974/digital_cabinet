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

  @Column(name = "inviter_username")
  private String inviterUsername;

  @ManyToOne
  @JoinColumn(name = "invited_user_id")
  private User invitedUser;

  @ManyToOne
  @JoinColumn(name = "CASA_ID")
  private House house;

  public Inbox() {
  }

  // getters and setters
  public Long getId() {
    return inbox_Id;
  }

  public String getInviterUsername() {
    return inviterUsername;
  }

  public void setInviterUsername(String inviterUsername) {
    this.inviterUsername = inviterUsername;
  }

  public User getInvitedUser() {
    return invitedUser;
  }

  public void setInvitedUser(User invitedUser) {
    this.invitedUser = invitedUser;
  }

  public House getHouse() {
    return house;
  }

  public void setHouse(House house) {
    this.house = house;
  }
}