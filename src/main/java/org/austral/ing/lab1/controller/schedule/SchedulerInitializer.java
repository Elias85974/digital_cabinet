package org.austral.ing.lab1.controller.schedule;

import org.quartz.SchedulerException;
import org.quartz.impl.StdSchedulerFactory;

import javax.persistence.EntityManagerFactory;
import java.util.ArrayList;
import java.util.List;

public class SchedulerInitializer {

    private final EntityManagerFactory entityManagerFactory;
    private final List<NotificationJob> jobs = new ArrayList<>();
    private org.quartz.Scheduler scheduler;

    public SchedulerInitializer(EntityManagerFactory entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

    public void init() {
        try {
            // Initialize the scheduler but do not start it yet
            scheduler = StdSchedulerFactory.getDefaultScheduler();
            // Register all jobs here
            ProductExpiration productExpiration = new ProductExpiration();
            productExpiration.setEntityManagerFactory(entityManagerFactory);
            jobs.add(productExpiration);
            // Add more jobs as needed
            initializeJobs(); // Now also encapsulates job initialization
        } catch (SchedulerException e) {
            System.err.println("Failed to initialize the scheduler: " + e.getMessage());
            // Handle the exception appropriately
        }
    }

    private void initializeJobs() throws SchedulerException {
        for (NotificationJob job : jobs) {
            job.scheduleJob(scheduler); // Schedule all jobs
        }
        // Start the scheduler after all jobs have been scheduled
        scheduler.start();
    }
}