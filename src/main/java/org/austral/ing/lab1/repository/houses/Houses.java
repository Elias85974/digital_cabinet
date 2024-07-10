package org.austral.ing.lab1.repository.houses;

import org.austral.ing.lab1.model.chat.Chat;
import org.austral.ing.lab1.model.house.House;
import org.austral.ing.lab1.model.inventory.Inventory;
import org.austral.ing.lab1.model.user.User;
import org.austral.ing.lab1.model.house.livesIn.LivesIn;
import org.austral.ing.lab1.model.notification.HouseInvitation;
import org.austral.ing.lab1.repository.users.Users;
import org.jetbrains.annotations.NotNull;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

public class Houses {
    private final EntityManager entityManager;

    public Houses(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Optional<House> findById(Long id) {
        return entityManager.createQuery("SELECT h FROM House h WHERE h.casa_ID = :id", House.class)
                .setParameter("id", id).getResultList()
                .stream()
                .findFirst();
    }

    // Get all the users that live in a house with in the userId, userName format excluding the admin and the user who made the call
    public List<Map<String, String>> getUsersOfHouse(Long houseId, Long userId) {
        List<User> users = entityManager.createQuery("SELECT u FROM User u JOIN u.livesIns l WHERE l.casa.casa_ID = :houseId AND l.role = false AND u.usuario_ID != :userId", User.class)
                .setParameter("houseId", houseId)
                .setParameter("userId", userId)
                .getResultList();

        // Convert users to the required json format
        return users.stream()
                .map(user -> Map.of("userId", user.getUsuario_ID().toString(), "username", user.getNombre()))
                .collect(Collectors.toList());
    }

    // Get all the users living in the house
    public List<User> getHouseUsers(Long casaId) {
        return entityManager.createQuery("SELECT u FROM User u JOIN u.livesIns l WHERE l.casa.casa_ID = :casaId", User.class)
                .setParameter("casaId", casaId)
                .getResultList();
    }

    public House persist(House house) {
        entityManager.persist(house);
        return house;
    }

    // Associate a House with a user and create an inventory for the house
    public void createUserHouse(House house, Long userId) {
        Users usersRepo = new Users(entityManager);
        EntityTransaction tx = entityManager.getTransaction();
        tx.begin();
        Optional<User> optionalUser = usersRepo.findById(userId);
        if (optionalUser.isEmpty()) {
            tx.rollback();
            throw new IllegalArgumentException("User not found");
        }
        User user = optionalUser.get();
        final Inventory inventory = new Inventory();
        final Chat chat = new Chat(house.getNombre());
        entityManager.persist(inventory);
        house.setInventario(inventory);
        entityManager.persist(chat);
        house.setChat(chat);
        entityManager.persist(house);
        inventory.setHouse(house);
        chat.setHouse(house);
        makeUserLiveInHouse(user, house, true);
        entityManager.refresh(user);
        tx.commit();
    }

    public void inviteUser(Long userId, String invitedUserEmail, Long houseId, Users usersRepo) {
        EntityTransaction tx = entityManager.getTransaction();
        tx.begin();

        Optional<User> invitingUserOptional = usersRepo.findById(userId);
        Optional<User> invitedUserOptional = usersRepo.findByEmail(invitedUserEmail);
        Optional<House> houseOptional = findById(houseId);

        if (invitedUserOptional.isEmpty()) {
            throw new IllegalArgumentException("The user you are trying to invite does not exist.");
        }

        if (invitingUserOptional.isEmpty() || houseOptional.isEmpty()) {
            throw new IllegalArgumentException("Something went wrong when trying to invite the user to the house.");
        }

        HouseInvitation inbox = createInboxInvitation(invitingUserOptional.get(), invitedUserOptional.get(), houseOptional.get());

        entityManager.persist(inbox);

        tx.commit();
    }

    public void makeUserLiveInHouse(User user, House house, boolean role) {
        LivesIn livesIn = LivesIn.create(user, house, role).build();
        entityManager.persist(livesIn);
    }

    private @NotNull HouseInvitation createInboxInvitation(User inviterUser, User invitedUser, House house) {
        HouseInvitation houseInvitation = new HouseInvitation(house, inviterUser);
        houseInvitation.setInbox_user(invitedUser);
        invitedUser.addNotification(houseInvitation);
        return houseInvitation;
    }
}
