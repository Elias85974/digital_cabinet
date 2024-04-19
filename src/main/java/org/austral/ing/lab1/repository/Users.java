package org.austral.ing.lab1.repository;

import org.austral.ing.lab1.model.User;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.Optional;

public class Users {

    private final EntityManager entityManager;

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
}
