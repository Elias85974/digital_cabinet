package org.austral.ing.lab1.controller;

import com.google.gson.Gson;
import org.austral.ing.lab1.object.jsonparsable.ExpirationInfo;
import org.austral.ing.lab1.repository.chats.Chats;
import org.austral.ing.lab1.repository.inboxes.ChatNotifications;
import org.austral.ing.lab1.repository.inboxes.HouseInvitations;
import org.austral.ing.lab1.repository.inboxes.NearExpirations;
import org.austral.ing.lab1.repository.inboxes.Notifications;
import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import java.util.List;
import java.util.Map;

public class InboxController {
    private final Gson gson = new Gson();
    private final EntityManagerFactory entityManagerFactory;

    public InboxController(EntityManagerFactory entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

    public void init() {

        // Route to get the house invitations of a given user
        Spark.get("/inbox/getHouseInvitations", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            HouseInvitations houseInvitations = new HouseInvitations(entityManager);
            try {
                Long userId = Long.parseLong(req.headers("UserId"));
                List<Map<String, Object>> inboxMessage = houseInvitations.getHousesByUserId(userId);
                resp.status(200);
                resp.type("application/json");
                return gson.toJson(inboxMessage);
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while getting the inbox, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to get the soon to expire products of a given user
        Spark.get("/inbox/getSoonToExpire", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            NearExpirations expirationsRepo = new NearExpirations(entityManager);
            try {
                Long userId = Long.parseLong(req.headers("UserId"));
                List<ExpirationInfo> inboxMessage = expirationsRepo.getExpiringStocks(userId);
                resp.status(200);
                resp.type("application/json");
                return gson.toJson(inboxMessage);
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while getting the soon to expire products, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to get the chat notifications of a user
        Spark.get("/inbox/getChatNotifications", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Chats chatNotifications = new Chats(entityManager);
            try {
                Long userId = Long.parseLong(req.headers("UserId"));
                String chatsNotifications = gson.toJson(chatNotifications.getNotifications(userId));
                resp.status(200);
                resp.type("application/json");
                return chatsNotifications;
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while getting the chat notifications, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to get the sizes of the different notifications of a user (unused)
        Spark.get("/inbox/getInboxSize", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Notifications notifications = new Notifications(entityManager);
            try {
                Long userId = Long.parseLong(req.headers("UserId"));
                Map<String, Long> notificationCounts = notifications.getNotificationCounts(userId);
                resp.status(200);
                resp.type("application/json");
                return gson.toJson(notificationCounts);
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while getting the notification sizes, please try again";
            } finally {
                entityManager.close();
            }
        });
    }
}
