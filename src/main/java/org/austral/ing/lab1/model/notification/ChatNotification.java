package org.austral.ing.lab1.model.notification;

import org.austral.ing.lab1.model.chat.Message;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@DiscriminatorValue("ChatNotification")
public class ChatNotification extends Notification {
    @ManyToOne
    private Message lastMessage;

    @Column(name = "UNREAD_MESSAGES")
    private int unreadMessages;

    public ChatNotification(Message lastMessage) {
        this.lastMessage = lastMessage;
        this.unreadMessages = 1;
    }

    public ChatNotification() {
    }

    public Message getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(Message message) {
        this.lastMessage = message;
    }

    public int getUnreadMessages() {
        return unreadMessages;
    }

    public void incrementUnreadMessages() {
        unreadMessages++;
    }
}