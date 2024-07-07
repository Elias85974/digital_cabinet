package org.austral.ing.lab1.model.notification;

import org.austral.ing.lab1.model.user.User;

import javax.persistence.*;

import static javax.persistence.InheritanceType.*;

@Entity
@Inheritance(strategy = SINGLE_TABLE)
@DiscriminatorColumn(name = "notification_type")
public abstract class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "USUARIO_ID", referencedColumnName = "USUARIO_ID")
    private User inbox_user;

    // getters and setters

    public Notification() {
    }

    public Long getId() {
        return id;
    }

    public User getInbox_user() {
        return inbox_user;
    }

    public void setInbox_user(User user) {
        this.inbox_user = user;
    }
}