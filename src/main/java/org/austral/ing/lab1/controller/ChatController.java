package org.austral.ing.lab1.controller;

import com.google.gson.Gson;
import org.austral.ing.lab1.repository.chats.Chats;
import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;

public class ChatController {
    Gson gson = new Gson();
    private final EntityManagerFactory entityManagerFactory;

    public ChatController(EntityManagerFactory entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

    public void init() {

        // Route to get the chats of a user
        Spark.get("/chats/user", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Chats chatsRepo = new Chats(entityManager);
            try {
                Long userId = Long.parseLong(req.headers("UserId"));
                String chatsJson = gson.toJson(chatsRepo.getChats(userId));
                resp.type("application/json");
                return chatsJson;
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while getting the chats of the user, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to get the messages of a chat
        Spark.get("/chat/:chatId/messages", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Chats chatsRepo = new Chats(entityManager);
            try {
                Long chatId = Long.parseLong(req.params("chatId"));
                Long userId = Long.parseLong(req.headers("UserId"));
                String messagesJson = gson.toJson(chatsRepo.getMessages(chatId, userId));
                resp.type("application/json");
                return messagesJson;
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while getting the messages of the chat, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to send a message to a chat
        Spark.post("/chat/:chatId/messages/:message", "application/json", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Chats chatsRepo = new Chats(entityManager);
            try {
                Long chatId = Long.parseLong(req.params("chatId"));
                Long userId = Long.parseLong(req.headers("UserId"));
                String message = req.params("message");
                chatsRepo.sendMessage(chatId, userId, message);
                resp.type("message");
                resp.status(201);
                return "Message sent successfully";
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while sending the message, please try again";
            } finally {
                entityManager.close();
            }
        });
    }
}
