package org.austral.ing.lab1.model.notification;

import org.austral.ing.lab1.model.chat.Chat;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@DiscriminatorValue("ChatNotification")
public class ChatNotification extends Notification {
    @ManyToOne
    private Chat chat;

    // getters and setters
}