package org.austral.ing.lab1.model.notification;

import org.austral.ing.lab1.model.House;
import org.austral.ing.lab1.model.User;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@DiscriminatorValue("HouseInvitation")
public class HouseInvitation extends Notification {
    @ManyToOne
    private House house;

    @ManyToOne
    private User inviterUser;

    // getters and setters

    public HouseInvitation(House house, User inviterUser) {
        this.house = house;
        this.inviterUser = inviterUser;
    }

    public HouseInvitation() {
    }

    public House getHouse() {
        return house;
    }

    public void setHouse(House house) {
        this.house = house;
    }

    public User getInviterUser() {
        return inviterUser;
    }

    public void setInviterUser(User invitingUser) {
        this.inviterUser = invitingUser;
    }
}