package org.austral.ing.lab1.controller.schedule;

import org.quartz.SchedulerException;
import org.quartz.Scheduler;

import javax.persistence.EntityManagerFactory;

public interface NotificationJob {
    void scheduleJob(Scheduler scheduler) throws SchedulerException;
}
