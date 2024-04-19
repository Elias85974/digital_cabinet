package org.austral.ing.lab1.model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "INVENTORY")
public class Inventory {
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private Long inventario_ID;

    @OneToOne
    @JoinColumn(name = "HOUSE_ID")
    private House casa;

    @ManyToMany
    @JoinColumn(name = "STATE")
    private Boolean estado;

    @OneToMany(targetEntity = Product.class)
    @JoinColumn(name = "inventario_id")
    private List<Product> productos;

    public Inventory() { }

    public void setID(Long inventarioId) {
        this.inventario_ID = inventarioId;
    }

    public Long getInventario_ID() {
        return inventario_ID;
    }

    public Long getCasaID() {
        return casa.getCasa_ID();
    }

    public Inventory getInventory() {
        return this;
    }
}