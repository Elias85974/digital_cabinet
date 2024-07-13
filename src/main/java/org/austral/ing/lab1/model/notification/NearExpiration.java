package org.austral.ing.lab1.model.notification;

import org.austral.ing.lab1.model.inventory.Stock;
import org.austral.ing.lab1.model.inventory.product.Product;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@Entity
@DiscriminatorValue("NearExpiration")
public class NearExpiration extends Notification {
    @ManyToOne
    private Stock stock;

    @Column(name = "DAYS_LEFT", nullable = false)
    private Long daysLeft;

    // getters and setters
    public Stock getStock() {
        return stock;
    }

    public void setStock(Stock stock) {
        this.stock = stock;
    }

    public Long getDaysLeft() {
        return daysLeft;
    }

    public void setDaysLeft(Long daysLeft) {
        this.daysLeft = daysLeft;
    }
}