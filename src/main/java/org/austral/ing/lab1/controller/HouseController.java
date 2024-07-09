package org.austral.ing.lab1.controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.austral.ing.lab1.model.house.House;
import org.austral.ing.lab1.model.user.User;
import org.austral.ing.lab1.model.house.livesIn.LivesIn;
import org.austral.ing.lab1.model.notification.HouseInvitation;
import org.austral.ing.lab1.repository.houses.Houses;
import org.austral.ing.lab1.repository.houses.LivesIns;
import org.austral.ing.lab1.repository.inboxes.HouseInvitations;
import org.austral.ing.lab1.repository.users.Users;
import org.jetbrains.annotations.NotNull;
import spark.Response;
import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class HouseController {
    private final EntityManagerFactory entityManagerFactory;
    private final Gson gson = new Gson();
    private Houses housesRepo;
    private Users usersRepo;
    private LivesIns livesInsRepo;

    public HouseController(EntityManagerFactory entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

    public void init() {
        // Route to create a house of a given user
        Spark.put("/houses", "application/json", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            housesRepo = new Houses(entityManager);
            try {
                final Long userId = Long.valueOf(req.headers("UserId"));
                final House house = House.fromJson(req.body());
                housesRepo.createUserHouse(house, userId);
                resp.type("application/json");
                resp.status(201);
                return "House created successfully";
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while creating the house, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to invite a user to a house
        Spark.put("/houses/inviteUser", "application/json", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            usersRepo = new Users(entityManager);
            housesRepo = new Houses(entityManager);
            try {
                JsonObject jsonObject = new Gson().fromJson(req.body(), JsonObject.class);
                Long userId = Long.parseLong(req.headers("UserId"));
                String invitedUserEmail = jsonObject.get("invitedUser").getAsString();
                Long houseId = jsonObject.get("houseId").getAsLong();

                housesRepo.inviteUser(userId, invitedUserEmail, houseId, usersRepo);

                return "The invitation was sent!";
            } catch (Exception e) {
                resp.status(500);
                resp.type("application/json");
                return gson.toJson(e.getMessage());
            } finally {
                entityManager.close();
            }
        });

        // Route to remove a user from a house
        Spark.delete("/houses/:houseId/users/:userId", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            // Initialize the users and houses repositories for the search
            usersRepo = new Users(entityManager);
            housesRepo = new Houses(entityManager);
            livesInsRepo = new LivesIns(entityManager);
            try {
                Long houseId = Long.parseLong(req.params("houseId"));
                Long userId = Long.parseLong(req.params("userId"));

                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();

                Optional<HouseUserPair> result = getHouseAndUser(resp, userId, houseId);
                if (result.isEmpty()) {
                    return "User or House not found";
                }

                HouseUserPair houseUserPair = result.get();

                Optional<LivesIn> livesIn = livesInsRepo.findByUserAndHouse(houseUserPair.user, houseUserPair.house);

                if (livesIn.isEmpty()) {
                    resp.status(404);
                    return "User is not living in this house";
                }

                livesInsRepo.delete(livesIn.get());

                tx.commit();
                return "User successfully removed from house";
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while removing the user from the house, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to process an invitation
        Spark.post("/houses/inbox/processInvitation", "application/json", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            // Initialize the users and houses repositories for the search
            usersRepo = new Users(entityManager);
            housesRepo = new Houses(entityManager);
            HouseInvitations houseInvitationsRepo = new HouseInvitations(entityManager);
            try {
                JsonObject invitationJson = new Gson().fromJson(req.body(), JsonObject.class);

                Long userId = Long.parseLong(req.headers("UserId"));
                Long houseId = invitationJson.get("houseId").getAsLong();
                boolean isAccepted = invitationJson.get("isAccepted").getAsBoolean();

                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();

                Optional<HouseUserPair> result = getHouseAndUser(resp, userId, houseId);
                if (result.isEmpty()) {
                    return "User or House not found";
                }

                HouseUserPair houseUserPair = result.get();
                HouseInvitation houseInvitation = houseInvitationsRepo.findByUserAndHouse(houseUserPair.user, houseUserPair.house);
                houseInvitationsRepo.delete(houseInvitation);

                if (isAccepted) {
                    housesRepo.makeUserLiveInHouse(houseUserPair.user, houseUserPair.house, false);
                }

                tx.commit();
                return "Invitation processed successfully";
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while processing the invitation, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to create a house of a given user from a token???
        Spark.put("/houses/:houseId/users/:token", "application/json", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            housesRepo = new Houses(entityManager);
            usersRepo = new Users(entityManager);
            try {
                final String houseId = req.params("houseId");
                final String token = req.params("token");

                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();

                final Optional<House> houseOptional = housesRepo.findById(Long.valueOf(houseId));
                final Optional<User> userOptional = usersRepo.findByToken(token);

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

                final LivesIn livesIn = LivesIn.create(user, house, true).build();
                entityManager.persist(livesIn);

                tx.commit();
                return "User now lives in the house";
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while changing the house, please try again";
            } finally {
                entityManager.close();
            }
        });

        // Route to get the users of a house
        Spark.get("/houses/:houseId/users", (req, resp) -> {
            EntityManager entityManager = entityManagerFactory.createEntityManager();
            housesRepo = new Houses(entityManager);
            try {
                Long houseId = Long.parseLong(req.params("houseId"));
                Long userId = Long.parseLong(req.headers("UserId"));

                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();

                List<Map<String, String>> usersList = housesRepo.getUsersOfHouse(houseId, userId);

                tx.commit();

                if (!usersList.isEmpty()) {
                    resp.status(200);
                    resp.type("application/json");
                    return gson.toJson(usersList);
                } else {
                    resp.status(404);
                    return "House not found";
                }
            } catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while getting the users, please try again";
            } finally {
                entityManager.close();
            }
        });
    }

    // This method requires the users and houses repositories well initialized
    private @NotNull Optional<HouseUserPair> getHouseAndUser(Response resp, Long userId, Long houseId) {
        Optional<User> userOptional = usersRepo.findById(userId);
        Optional<House> houseOptional = housesRepo.findById(houseId);

        if (userOptional.isEmpty() || houseOptional.isEmpty()) {
            resp.status(404);
            return Optional.empty();
        }

        User user = userOptional.get();
        House house = houseOptional.get();
        return Optional.of(new HouseUserPair(user, house));
    }

    private static class HouseUserPair {
        public final User user;
        public final House house;

        public HouseUserPair(User user, House house) {
            this.user = user;
            this.house = house;
        }
    }
}