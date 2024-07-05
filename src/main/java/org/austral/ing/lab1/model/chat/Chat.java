package org.austral.ing.lab1.model.chat;

import org.austral.ing.lab1.model.House;
import org.austral.ing.lab1.model.User;
import org.austral.ing.lab1.object.SpecialSet;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "CHAT")
public class Chat {
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private Long chatId;

    @Column(name = "CHAT_NAME", nullable = false)
    private String chatName;

    @OneToOne
    @JoinColumn(name = "CASA_ID", referencedColumnName = "CASA_ID")
    private House house;

    @Column(name = "MESSAGE", nullable = false)
    private String message;

    @OneToMany(mappedBy = "chat")
    private List<Message> messages = new ArrayList<>();

    public Chat() {
    }

    public Long getChatId() {
        return chatId;
    }

    public void setChatName(String chatName) {
        this.chatName = chatName;
    }

    public String getChatName() {
        return chatName;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public List<Message> getMessages() {
        return messages;
    }

    public void addMessage(Message message) {
        messages.add(message);
    }

    public House getHouse() {
        return house;
    }

    public void setHouse(House house) {
        this.house = house;
    }
}
