package org.austral.ing.lab1.model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "STOCK")
public class Stock {
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private Long ID_Stock;

    @Column(name = "EXPIRATION_DATE")
    private Date vencimiento;

    @Column(name = "CUANTITY_EXPIRATION_DATE")
    private Integer tipoDeCantidad;

    @JoinColumn(name = "INVENTORY_ID")
    private Long inventory_ID;

    @JoinColumn(name = "PRODUCT_ID")
    private Long product_ID;

}