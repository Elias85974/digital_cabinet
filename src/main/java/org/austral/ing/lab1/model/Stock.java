package org.austral.ing.lab1.model;

import com.google.gson.Gson;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "STOCK")
public class Stock {
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private Long stock_ID;

    @OneToOne
    @JoinColumn(name = "INVENTARIO_ID", referencedColumnName = "INVENTARIO_ID")
    private Inventory inventario;

    @Column(name = "EXPIRATION_DATE")
    private Date vencimiento;

    @Column(name = "QUANTITY_EXPIRATION_DATE")
    private Long cantidadVencimiento;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "PRODUCT_ID", referencedColumnName = "PRODUCTO_ID")
    private Product product;

    public Stock() {}

    private Stock(StockBuilder stockBuilder) {
        this.cantidadVencimiento = stockBuilder.cantidad;
        this.product = stockBuilder.product;
    }

    public static StockBuilder create(long cantidad) {
        return new StockBuilder(cantidad);
    }

    public Long getCantidadVencimiento() {
        return cantidadVencimiento;
    }

    public Product getProduct() {
        return product;
    }

    public void setInventario(Inventory inventario) {
        if (this.inventario != inventario) {
            this.inventario = inventario;
        }
    }

    public void setProduct(Product product) {
        if (this.product != product) {
            this.product = product;
        }
    }

    // Not being used for now
    public String asJson() {
        Gson gson = new Gson();
        return gson.toJson(this);
    }

    public static class StockBuilder {
        private final long cantidad;
        private Product product;
        public StockBuilder(long cantidad) {
            this.cantidad = cantidad;
        }

        public StockBuilder setProduct(Product product) {
            this.product = product;
            return this;
        }

        public Stock build() {
            return new Stock(this);
        }
    }
}