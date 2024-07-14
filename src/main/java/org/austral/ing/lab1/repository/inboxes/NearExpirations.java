package org.austral.ing.lab1.repository.inboxes;

import org.austral.ing.lab1.model.house.House;
import org.austral.ing.lab1.model.inventory.Stock;
import org.austral.ing.lab1.model.notification.NearExpiration;
import org.austral.ing.lab1.model.user.User;
import org.austral.ing.lab1.object.jsonparsable.ExpirationInfo;
import org.austral.ing.lab1.repository.users.Users;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class NearExpirations {
    private final EntityManager entityManager;

    public NearExpirations(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public List<ExpirationInfo> getNearExpirationsForUser(Long userId) {
        Users users = new Users(entityManager);
        User user = users.findById(userId).orElseThrow();
        List<House> houses = user.getHouses();
        List<ExpirationInfo> nearExpirationsInfo = new ArrayList<>();

        for (House house : houses) {
            TypedQuery<NearExpiration> query = entityManager.createQuery(
                    "SELECT n FROM NearExpiration n WHERE n.stock.inventario = :inventory", NearExpiration.class);
            query.setParameter("inventory", house.getInventario());

            List<NearExpiration> nearExpirations = query.getResultList();

            for (NearExpiration nearExpiration : nearExpirations) {
                String productName = nearExpiration.getStock().getProduct().getNombre();
                // This can be negative if the product is already expired but not ignored
                Long daysLeft = nearExpiration.getDaysLeft();

                nearExpirationsInfo.add(new ExpirationInfo(house.getCasa_ID(), house.getNombre(), productName, daysLeft));
            }
        }

        return nearExpirationsInfo;
    }

    public List<Stock> getAllExpiringAndExpiredStocks() {
        LocalDate today = LocalDate.now();
        // Optionally, set a start date far enough in the past to include all relevant expired products
        LocalDate startDate = today.minusYears(24);

        TypedQuery<Stock> query = entityManager.createQuery(
                "SELECT s FROM Stock s WHERE s.vencimiento BETWEEN :startDate AND :twoWeeksFromNow", Stock.class);
        query.setParameter("startDate", java.sql.Date.valueOf(startDate));
        query.setParameter("twoWeeksFromNow", java.sql.Date.valueOf(today.plusWeeks(2)));

        return query.getResultList();
    }

    public NearExpiration findOrCreateByStockAndUser(Long stockId, Long userId) {
        // Check if a notification already exists
        TypedQuery<NearExpiration> query = entityManager.createQuery(
                "SELECT n FROM NearExpiration n WHERE n.stock.id = :stockId AND n.inbox_user.usuario_ID = :userId", NearExpiration.class);
        query.setParameter("stockId", stockId);
        query.setParameter("userId", userId);
        NearExpiration notification = query.getResultStream().findFirst().orElse(null);

        // If no notification exists, create a new one
        if (notification == null) {
            notification = new NearExpiration();
            Stock stock = entityManager.find(Stock.class, stockId);
            User user = entityManager.find(User.class, userId);

            if (stock == null || user == null) {
                throw new IllegalArgumentException("Stock or User not found");
            }

            notification.setStock(stock);
            notification.setInbox_user(user);
        }

        return notification;
    }

    public boolean saveOrUpdate(NearExpiration notification) {
        if (notification.getId() == null) {
            this.entityManager.persist(notification);
            return true;
        } else {
            this.entityManager.merge(notification);
            return false;
        }
    }
}
