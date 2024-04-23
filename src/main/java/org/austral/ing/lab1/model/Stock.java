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

    @Column(name = "EXPIRATION_DATE")
    private Date vencimiento;

    @Column(name = "QUANTITY_EXPIRATION_DATE")
    private Long cantidadVencimiento;

    @ManyToOne
    @JoinColumn(name = "INVENTORY_ID", referencedColumnName = "INVENTARIO_ID")
    private Inventory inventario;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "PRODUCT_ID", referencedColumnName = "PRODUCTO_ID")
    private Product product;

    public Stock() {}

    private Stock(StockBuilder stockBuilder) {
        this.inventario = stockBuilder.inventario;
        this.cantidadVencimiento = stockBuilder.cantidad;
    }

    public static StockBuilder create(long cantidad) {
        return new StockBuilder(cantidad);
    }

    public Long getCantidadVencimiento() {
        return cantidadVencimiento;
    }

    public void setInventario(Inventory inventario) {
        this.inventario = inventario;
    }

    public static class StockBuilder {
        private final long cantidad;
        private Inventory inventario;
        private Product product;
        public StockBuilder(long cantidad) {
            this.cantidad = cantidad;
        }

        public StockBuilder setInventario(Inventory inventario) {
            this.inventario = inventario;
            return this;
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