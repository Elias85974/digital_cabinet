package org.austral.ing.lab1.controller;

import com.google.gson.Gson;
import org.austral.ing.lab1.object.ExpirationInfo;
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
        Spark.get("/getInbox/:userId", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            HouseInvitations houseInvitations = new HouseInvitations(entityManager);
            try {
                Long userId = Long.parseLong(req.params("userId"));
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
        Spark.get("/getSoonToExpire/:userId", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            NearExpirations expirationsRepo = new NearExpirations(entityManager);
            try {
                Long userId = Long.parseLong(req.params("userId"));
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
        Spark.get("/getChatNotifications/:userId", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            ChatNotifications chatNotifications = new ChatNotifications(entityManager);
            try {
                Long userId = Long.parseLong(req.params("userId"));
                List<Map<String, Object>> inboxMessage = chatNotifications.getChatNotifications(userId);
                resp.status(200);
                resp.type("application/json");
                return gson.toJson(inboxMessage);
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while getting the chat notifications, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to get the sizes of the different notifications of a user
        Spark.get("/getInboxSize/:userId", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            Notifications notifications = new Notifications(entityManager);
            try {
                Long userId = Long.parseLong(req.params("userId"));
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