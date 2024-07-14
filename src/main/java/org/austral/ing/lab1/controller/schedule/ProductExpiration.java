package org.austral.ing.lab1.controller.schedule;

import org.austral.ing.lab1.model.house.House;
import org.austral.ing.lab1.model.inventory.Stock;
import org.austral.ing.lab1.model.notification.NearExpiration;
import org.austral.ing.lab1.model.user.User;
import org.austral.ing.lab1.object.EmailSender;
import org.austral.ing.lab1.repository.houses.Houses;
import org.austral.ing.lab1.repository.inboxes.NearExpirations;
import org.quartz.*;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.TimeZone;

public class ProductExpiration implements Job, NotificationJob {

    private static EntityManagerFactory entityManagerFactory;

    public ProductExpiration() {
    }

    public void setEntityManagerFactory(EntityManagerFactory entityManagerFactory) {
        ProductExpiration.entityManagerFactory = entityManagerFactory;
    }

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        try {
            processExpiringStocks();
        } catch (Exception e) {
            // Log the exception, perform any necessary cleanup, etc.
            throw new JobExecutionException(e);
        }
    }

    @Override
    public void scheduleJob(Scheduler scheduler) throws SchedulerException {
        JobDetail jobDetail = JobBuilder.newJob(ProductExpiration.class)
                .withIdentity("productExpirationCheckJob", "group1").build();

        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("cronTrigger", "group1")
                .withSchedule(CronScheduleBuilder.cronSchedule("0 0 0 * * ?")
                        .inTimeZone(TimeZone.getTimeZone("GMT-3")))
                .build();

        scheduler.scheduleJob(jobDetail, trigger);
    }

public void processExpiringStocks() {
    EntityManager entityManager = entityManagerFactory.createEntityManager();
    NearExpirations nearExpirationsRepo = new NearExpirations(entityManager);
    Houses housesRepo = new Houses(entityManager); // Assuming you have a Houses repository
    List<Stock> expiringStocks = nearExpirationsRepo.getAllExpiringAndExpiredStocks();
    LocalDate today = LocalDate.now();

    try {
        entityManager.getTransaction().begin();

        for (Stock stock : expiringStocks) {
            LocalDate expirationDate = stock.getExpirationDate().toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();
            long daysUntilExpiration = ChronoUnit.DAYS.between(today, expirationDate);

            // Assuming each stock is related to one house
            List<User> users = housesRepo.getHouseUsers(stock.getInventario_ID()); // Assuming House entity has getUsers method
            Optional<House> h = housesRepo.findById(stock.getInventario_ID());
            if (h.isEmpty()) {
                throw new IllegalArgumentException("House not found");
            }

            for (User user : users) {
                NearExpiration notification = nearExpirationsRepo.findOrCreateByStockAndUser(stock.getId(), user.getUsuario_ID());
                notification.setDaysLeft(daysUntilExpiration);
                boolean wasNew = nearExpirationsRepo.saveOrUpdate(notification);
                if (wasNew) {
                    // Send mail to the user
                    EmailSender.sendEmail(user.getMail(), "Product expiration notification",
                            "Your product " + stock.getProduct().getNombre() + " is about to expire in " + daysUntilExpiration + " days. \n" +
                                    "Please check your " + h.get().getNombre() + "'s inventory");
                }
            }
        }

        entityManager.getTransaction().commit();
    } catch (Exception e) {
        entityManager.getTransaction().rollback();
        throw e;
    } finally {
        entityManager.close();
    }
}
}