package org.austral.ing.lab1.repository.users;

import com.auth0.jwt.exceptions.JWTVerificationException;
import org.austral.ing.lab1.controller.TokenValidator;
import org.austral.ing.lab1.model.user.User;
import org.austral.ing.lab1.model.user.WishList;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

public class Users {

    private final EntityManager entityManager;
    private static final SecureRandom secureRandom = new SecureRandom();
    private static final Base64.Encoder base64Encoder = Base64.getUrlEncoder();

    public Users(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Optional<User> findById(Long id) {
        return Optional.ofNullable(entityManager.find(User.class, id));
    }

    public Optional<User> findByEmail(String email) {
        return entityManager
            .createQuery("SELECT u FROM User u WHERE u.mail LIKE :email", User.class)
            .setParameter("email", email).getResultList()
            .stream()
            .findFirst();
    }

    public Optional<User> findByToken(String token) {
        return entityManager
            .createQuery("SELECT u FROM User u WHERE u.token LIKE :token", User.class)
            .setParameter("token", token).getResultList()
            .stream()
            .findFirst();
    }

    public List<User> listAll() {
        return entityManager.createQuery("SELECT u FROM User u", User.class).getResultList();
    }

    public User persist(User user) {
        entityManager.persist(user);
        return user;
    }

    // para cuando hagamos que pueda cambiar el mail o el nombre o lo q sea en ajustes
    public User modify(Long id, User newUserData) {
        Optional<User> userOptional = findById(id);

        if (!userOptional.isPresent()) {
            return null;
        }

        User user = userOptional.get();

        // Here you can set the new values for the user fields
        // For example, if User has a field called 'nombre', you can do:
        // user.setNombre(newUserData.getNombre());

        entityManager.merge(user);

        return user;
    }

    public void addProductToWishList(Long userId, String product) {
        // Get the user
        User user = entityManager.find(User.class, userId);

        // Create a new wishlist for the product
        WishList wishList = new WishList();
        wishList.setProduct(product);

        // Add the wishlist to the user's list of wishlists
        user.addWishList(wishList);
        wishList.setUsuario(user);

        // Persist the updated user and the new wishlist
        entityManager.persist(wishList);
        entityManager.persist(user);
    }

    public void createUserFromJson(String body) {
        EntityTransaction tx = entityManager.getTransaction();
        tx.begin();
        User user = User.fromJson(body);
        entityManager.persist(user);
        user.setAdminRole(user.getUsuario_ID() == 1);
        tx.commit();
    }

    public User createGoogleUser(String email, String name, String surname) {
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        String rndpwd = base64Encoder.encodeToString(randomBytes);
        User user = new User();
        user.setMail(email);
        user.setNombre(name);
        user.setApellido(surname);
        user.setPassword(rndpwd);
        entityManager.persist(user);
        user.setAdminRole(user.getUsuario_ID() == 1);
        return user;
    }

    public void setUserToken(Long userId, String newToken) {
        entityManager.getTransaction().begin();
        User user = entityManager.find(User.class, userId);
        if (user == null) {
            entityManager.getTransaction().rollback();
            throw new JWTVerificationException("User not found");
        }
        user.setToken(newToken);
        entityManager.getTransaction().commit();
    }
}
