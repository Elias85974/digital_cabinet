package org.austral.ing.lab1.repository.inboxes;

import org.austral.ing.lab1.model.house.House;
import org.austral.ing.lab1.model.inventory.Stock;
import org.austral.ing.lab1.model.user.User;
import org.austral.ing.lab1.object.ExpirationInfo;
import org.austral.ing.lab1.repository.users.Users;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class NearExpirations {
    private final EntityManager entityManager;

    public NearExpirations(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public List<ExpirationInfo> getExpiringStocks(Long userId) {
        Users users = new Users(entityManager);
        Optional<User> possibleUser = users.findById(userId);
        if (possibleUser.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }
        User user = possibleUser.get();
        List<House> houses = user.getHouses();

        List<ExpirationInfo> expiringStocks = new ArrayList<>();

        LocalDate today = LocalDate.now();
        LocalDate twoWeeksFromNow = today.plusWeeks(2);

        for (House house : houses) {
            TypedQuery<Stock> query = entityManager.createQuery(
                    "SELECT s FROM Stock s WHERE s.inventario.inventario_ID = :houseId AND s.vencimiento BETWEEN :today AND :twoWeeksFromNow",
                    Stock.class
            );
            query.setParameter("houseId", house.getCasa_ID());
            query.setParameter("today", java.sql.Date.valueOf(today));
            query.setParameter("twoWeeksFromNow", java.sql.Date.valueOf(twoWeeksFromNow));

            List<Stock> stocks = query.getResultList();

            for (Stock stock : stocks) {
                LocalDate expirationDate = stock.getExpirationDate().toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate();
                long daysUntilExpiration = ChronoUnit.DAYS.between(today, expirationDate);
                expiringStocks.add(new ExpirationInfo(house.getCasa_ID(), house.getNombre(), stock.getProduct().getNombre(), daysUntilExpiration));
            }
        }

        return expiringStocks;
    }
}
