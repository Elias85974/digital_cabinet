package org.austral.ing.lab1.repository.chats;

import org.austral.ing.lab1.model.chat.Chat;
import org.austral.ing.lab1.model.chat.Message;
import org.austral.ing.lab1.model.notification.ChatNotification;
import org.austral.ing.lab1.model.user.User;
import org.austral.ing.lab1.object.MessageInfo;
import org.austral.ing.lab1.repository.houses.Houses;
import org.austral.ing.lab1.repository.users.Users;
import org.jetbrains.annotations.NotNull;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.persistence.TypedQuery;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

public class Chats {
    private final EntityManager entityManager;

    public Chats(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Optional<Chat> findById(Long chatId) {
        return Optional.ofNullable(entityManager.find(Chat.class, chatId));
    }

    public List<MessageInfo> getMessages(Long chatId, Long userId) {
        EntityTransaction tx = entityManager.getTransaction();
        tx.begin();
        TypedQuery<Message> query = entityManager.createQuery(
                "SELECT m FROM Message m WHERE m.chat.chatId = :chatId", Message.class);
        query.setParameter("chatId", chatId);
        List<MessageInfo> messageInfos = getMessageInfos(chatId, query);
        removeNotification(chatId, userId);
        tx.commit();
        return messageInfos;
    }

    public void sendMessage(Long chatId, Long userId, String message) {
        EntityTransaction tx = entityManager.getTransaction();
        Users usersRepo = new Users(entityManager);
        tx.begin();
        Optional<User> possibleUser = usersRepo.findById(userId);
        Optional<Chat> possibleChat = findById(chatId);
        if (possibleUser.isEmpty() || possibleChat.isEmpty()) {
            tx.rollback();
            throw new IllegalArgumentException("User or chat not found");
        }
        User sender = possibleUser.get();
        Chat chat = possibleChat.get();
        Message newMessage = new Message(message, chat, sender);
        entityManager.persist(newMessage);
        notifyUsers(chat, userId, newMessage);
        tx.commit();
    }

    public List<ChatNotification> getNotifications(Long userId) {
        EntityTransaction tx = entityManager.getTransaction();
        tx.begin();
        TypedQuery<ChatNotification> query = entityManager.createQuery(
                "SELECT n FROM ChatNotification n WHERE n.inbox_user.usuario_ID = :userId", ChatNotification.class);
        query.setParameter("userId", userId);
        List<ChatNotification> notifications = query.getResultList();
        tx.commit();
        return notifications;
    }

    private @NotNull List<MessageInfo> getMessageInfos(Long chatId, TypedQuery<Message> query) {
        List<Message> messages = query.getResultList();
        List<MessageInfo> messageInfos = new ArrayList<>();
        for (Message message : messages) {
            String senderName = message.getSender().getNombre(); // Assuming the User entity has a 'nombre' field for the name
            Long senderId = message.getSender().getUsuario_ID();
            MessageInfo messageInfo = new MessageInfo(chatId, senderName, senderId.toString(), message.getContent());
            messageInfos.add(messageInfo);
        }
        return messageInfos;
    }

    private void removeNotification(Long chatId, Long userId) {
        TypedQuery<ChatNotification> query = entityManager.createQuery(
                "SELECT n FROM ChatNotification n WHERE n.inbox_user.usuario_ID = :userId AND n.lastMessage.chat.chatId = :chatId", ChatNotification.class);
        query.setParameter("chatId", chatId);
        query.setParameter("userId", userId);
        if (!query.getResultList().isEmpty()) {
            entityManager.remove(query.getSingleResult());
        }
    }

    private void notifyUsers(Chat chat, Long userId, Message newMessage) {
        ChatNotification notification;
        Houses housesRepo = new Houses(entityManager);
        List<User> users = housesRepo.getHouseUsers(chat.getHouse().getCasa_ID());
        for (User user : users) {
            if (!Objects.equals(user.getUsuario_ID(), userId)) {
                TypedQuery<ChatNotification> query = entityManager.createQuery(
                        "SELECT n FROM ChatNotification n WHERE n.inbox_user.usuario_ID = :userId AND n.lastMessage.chat.chatId = :chatId", ChatNotification.class);
                query.setParameter("chatId", chat.getChatId());
                query.setParameter("userId", userId);
                if (query.getResultList().isEmpty()) {
                    notification = new ChatNotification(newMessage);
                    notification.setInbox_user(user);
                    entityManager.persist(notification);
                } else {
                    notification = query.getSingleResult();
                    notification.incrementUnreadMessages();
                    notification.setLastMessage(newMessage);
                }
            }
        }
    }
}
