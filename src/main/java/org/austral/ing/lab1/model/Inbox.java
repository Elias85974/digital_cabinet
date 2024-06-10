package org.austral.ing.lab1.model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@Table(name = "INBOX")
public class Inbox<T> {
  @Id
  @GeneratedValue(generator = "increment")
  @GenericGenerator(name = "increment", strategy = "increment")
  private Long inboxId;

  @OneToOne
  @JoinColumn(name = "USUARIO_ID")
  private User usuario;
}
