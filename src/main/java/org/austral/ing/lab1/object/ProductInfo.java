package org.austral.ing.lab1.object;

import org.austral.ing.lab1.model.Product;

import java.util.Date;

public class ProductInfo {
    private Product product;
    private Long totalQuantity;
    private Date nearestExpirationDate;

    // constructor, getters and setters
    public ProductInfo(Product product, Long totalQuantity, Date nearestExpirationDate) {
        this.product = product;
        this.totalQuantity = totalQuantity;
        this.nearestExpirationDate = nearestExpirationDate;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Long getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(Long totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public Date getNearestExpirationDate() {
        return nearestExpirationDate;
    }

    public void setNearestExpirationDate(Date nearestExpirationDate) {
        this.nearestExpirationDate = nearestExpirationDate;
    }
}

