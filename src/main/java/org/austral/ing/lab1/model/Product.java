package org.austral.ing.lab1.model;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Product {
    @Id
    private Long product_ID;

    public void setProduct_ID(Long productId) {
        this.product_ID = productId;
    }

    public Long getProduct_ID() {
        return product_ID;
    }
}
