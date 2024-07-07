package org.austral.ing.lab1.model.notification;

import org.austral.ing.lab1.model.inventory.product.Product;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@DiscriminatorValue("NearExpiration")
public class NearExpiration extends Notification {
    @ManyToOne
    private Product product;

    @Column(name = "DAYS_LEFT", nullable = false)
    private int daysLeft;

    // getters and setters
}