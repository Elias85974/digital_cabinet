package org.austral.ing.lab1.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import org.austral.ing.lab1.model.House;
import org.austral.ing.lab1.model.Inbox;
import org.austral.ing.lab1.model.Inventory;
import org.austral.ing.lab1.model.User;
import org.austral.ing.lab1.model.livesIn.LivesIn;
import org.austral.ing.lab1.object.Invitation;
import org.austral.ing.lab1.repository.*;
import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

public class HouseController {
    private final EntityManagerFactory entityManagerFactory;

    public HouseController(EntityManagerFactory entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

    public void init() {
        // Route to create a house of a given user
        Spark.post("/houses/:userID", "application/json", (req, resp) -> {
            try {
                final Long userId = Long.valueOf(req.params("userID"));
                final EntityManager entityManager = entityManagerFactory.createEntityManager();
                Houses housesRepo = new Houses(entityManager);
                Inventories inventoriesRepo = new Inventories(entityManager);
                Users usersRepo = new Users(entityManager);
                final House house = House.fromJson(req.body());
                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                User user = usersRepo.findById(userId).get(); // Acá estamos seguros de que el usuario existe porque el token fue validado
                final Inventory inventory = new Inventory();
                inventoriesRepo.persist(inventory);
                house.setInventario(inventory);
                housesRepo.persist(house);
                inventory.setHouse(house);
                inventoriesRepo.persist(inventory);
                final LivesIn livesIn = LivesIn.create(user, house, true).build();
                entityManager.persist(livesIn);
                entityManager.refresh(user);
                resp.type("application/json");
                resp.status(201);
                tx.commit();
                // house.asJson();
                return resp;
            } catch (Exception e) {
                resp.status(500);
                return "An error occurred while creating the house, please try again";
            }
        });

        // Route to invite a user to my house
        Spark.put("/inviteUser", "application/json", (req, resp) -> {
            // Parse the JSON body of the request
            JsonObject jsonObject = new Gson().fromJson(req.body(), JsonObject.class);
            String userId = jsonObject.get("invitingUser").getAsString();
            String invitedUserEmail = jsonObject.get("invitedUser").getAsString();
            Long houseId = jsonObject.get("houseId").getAsLong();

            // Begin Business Logic
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Users usersRepo = new Users(entityManager);
            final Houses housesRepo = new Houses(entityManager);
            final Inboxes inboxesRepo = new Inboxes(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();

            Optional<User> invitingUserOptional = usersRepo.findById(Long.parseLong(userId));
            Optional<User> invitedUserOptional = usersRepo.findByEmail(invitedUserEmail);
            Optional<House> houseOptional = housesRepo.findById(houseId);

            if (invitingUserOptional.isEmpty() || invitedUserOptional.isEmpty() || houseOptional.isEmpty()) {
                resp.status(404);
                return "Inviting User, Invited User or House not found";
            }

            User invitingUser = invitingUserOptional.get();
            User invitedUser = invitedUserOptional.get();
            House house = houseOptional.get();

            Inbox inbox = new Inbox();
            inbox.setInviterUsername(invitingUser.getNombre());
            inbox.setInvitedUser(invitedUser);
            inbox.setHouse(house);

            inboxesRepo.persist(inbox);

            tx.commit();
            entityManager.close();

            resp.status(201);
            return "Inbox created successfully";
        });

        // Route to remove users from my house
        // Route to delete a user from a house
        Spark.delete("/houses/:houseId/users/:userId", (req, resp) -> {
            Long houseId = Long.parseLong(req.params("houseId"));
            Long userId = Long.parseLong(req.params("userId"));

            // Begin Business Logic
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Users usersRepo = new Users(entityManager);
            final Houses housesRepo = new Houses(entityManager);
            final LivesIns livesInsRepo = new LivesIns(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();

            Optional<User> userOptional = usersRepo.findById(userId);
            Optional<House> houseOptional = housesRepo.findById(houseId);

            if (userOptional.isEmpty() || houseOptional.isEmpty()) {
                resp.status(404);
                return "User or House not found";
            }

            User user = userOptional.get();
            House house = houseOptional.get();

            LivesIn livesIn = livesInsRepo.findByUserAndHouse(user, house);

            if (livesIn == null) {
                resp.status(404);
                return "User is not living in this house";
            }

            livesInsRepo.delete(livesIn);

            tx.commit();
            entityManager.close();

            resp.status(200);
            return "User successfully removed from house";
        });

        // Route to process the invitations of a user
        Spark.post("/processInvitations", "application/json", (req, resp) -> {
            // Parse the JSON array from the request body
            List<Map<String, Object>> invitationMaps = new Gson().fromJson(req.body(), new TypeToken<List<Map<String, Object>>>(){}.getType());

            List<Invitation> invitations = invitationMaps.stream().map(invitationMap -> {
                String userId = (String) invitationMap.get("userId");
                String houseId = (String) invitationMap.get("houseId");
                boolean isAccepted = (Boolean) invitationMap.get("isAccepted");
                return new Invitation(userId, houseId, isAccepted);
            }).collect(Collectors.toList());

            // Begin Business Logic
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Users usersRepo = new Users(entityManager);
            final Houses housesRepo = new Houses(entityManager);
            final Inboxes inboxesRepo = new Inboxes(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();

            for (Invitation invitation : invitations) {
                Long userId = Long.parseLong(invitation.getUserId());
                Long houseId = Long.parseLong(invitation.getHouseId());
                boolean accepted = invitation.isAccepted();

                Optional<User> userOptional = usersRepo.findById(userId);
                Optional<House> houseOptional = housesRepo.findById(houseId);

                if (userOptional.isEmpty() || houseOptional.isEmpty()) {
                    resp.status(404);
                    return "User or House not found";
                }

                User user = userOptional.get();
                House house = houseOptional.get();

                // Remove the Inbox relation
                Inbox inbox = inboxesRepo.findByUserAndHouse(user, house);
                inboxesRepo.delete(inbox);

                // If the invitation is accepted, create the LivesIn relation
                if (accepted) {
                    LivesIn livesIn = LivesIn.create(user, house, false).build();
                    entityManager.persist(livesIn);
                }
            }

            tx.commit();
            entityManager.close();

            resp.status(200);
            return "Invitations processed successfully";
        });

        // Route to change the house a user lives in
        Spark.put("/houses/:houseId/users/:token", "application/json", (req, resp) -> {
            final String houseId = req.params("houseId");
            final String token = req.params("token");

            /* Begin Business Logic */
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Houses houses = new Houses(entityManager);
            final Users users = new Users(entityManager);
            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            final Optional<House> houseOptional = houses.findById(Long.valueOf(houseId));
            final Optional<User> userOptional = users.findByToken(token);
            tx.commit();
            entityManager.close();
            /* End Business Logic */

            if (houseOptional.isEmpty()) {
                resp.status(404);
                return "Id not found";
            }

            if (userOptional.isEmpty()) {
                resp.status(404);
                return "User not found";
            }

            final House house = houseOptional.get();
            final User user = userOptional.get();

            /* Begin Business Logic */
            final EntityManager entityManager2 = entityManagerFactory.createEntityManager();
            final LivesIns livesIns = new LivesIns(entityManager2);
            EntityTransaction tx2 = entityManager2.getTransaction();
            tx2.begin();
            final LivesIn livesIn = LivesIn.create(user, house, true).build();
            livesIns.persist(livesIn);
            tx2.commit();
            entityManager2.close();
            /* End Business Logic */

            return "User now lives in the house";
        });

        // Route to get the users living in the same house
        Spark.get("/houses/:houseId/users", (req, resp) -> {
            Long houseId = Long.parseLong(req.params("houseId"));

            // Begin Business Logic
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Houses housesRepo = new Houses(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();

            List<Map<String, String>> usersJson = housesRepo.getUsersOfHouse(houseId);

            tx.commit();
            entityManager.close();

            if (usersJson != null) {
                resp.status(200);
                resp.type("application/json");
                return new Gson().toJson(usersJson);
            } else {
                resp.status(404);
                return "House not found";
            }
        });
    }
}
