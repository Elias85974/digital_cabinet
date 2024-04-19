package org.austral.ing.lab1.model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Product {

    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private Long product_ID;

    @Column(name = "NAME")
    private String nombre;

    @Column(name = "BRAND")
    private String marca;

    @Column(name = "CATEGORY_ID")
    private Long categoria_ID;



    public void setProduct_ID(Long productId) {
        this.product_ID = productId;
    }

    public Long getProduct_ID() {
        return product_ID;
    }
}
