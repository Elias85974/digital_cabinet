package org.austral.ing.lab1.model;

import org.austral.ing.lab1.model.notification.Notification;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "INBOX")
public class Inbox {
  @Id
  @GeneratedValue(generator = "increment")
  @GenericGenerator(name = "increment", strategy = "increment")
  private Long inbox_Id;

  @OneToMany(mappedBy = "inbox_user")
  private List<Notification> notifications = new ArrayList<>();

  @OneToOne
  @JoinColumn(name = "USUARIO_ID")
  private User user;

  public Inbox() {
  }

  // getters and setters
  public Long getId() {
    return inbox_Id;
  }

  public void setId(Long id) {
      this.inbox_Id = id;
  }

  public List<Notification> getNotifications() {
      return notifications;
  }

  public void addNotification(Notification notification) {
      this.notifications.add(notification);
  }

}