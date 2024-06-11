package org.austral.ing.lab1.repository;

import org.austral.ing.lab1.model.House;
import org.austral.ing.lab1.model.User;

import javax.persistence.EntityManager;
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

    public List<Map<String, String>> getUsersOfHouse(Long houseId) {
    List<User> users = entityManager.createQuery("SELECT u FROM User u JOIN u.livesIns l WHERE l.casa.casa_ID = :houseId", User.class)
        .setParameter("houseId", houseId)
        .getResultList();

    // Convert users to the required json format
    return users.stream()
    .map(user -> Map.of("userId", user.getUsuario_ID().toString(), "username", user.getNombre()))
    .collect(Collectors.toList());
}

    public House persist(House house) {
        entityManager.persist(house);
        return house;
    }
}
