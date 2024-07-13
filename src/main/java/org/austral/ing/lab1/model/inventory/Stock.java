package org.austral.ing.lab1.model.inventory;

import com.google.gson.Gson;
import org.austral.ing.lab1.model.inventory.product.Product;
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

    @ManyToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    @JoinColumn(name = "PRODUCT_ID", referencedColumnName = "PRODUCTO_ID")
    private Product product;

    @Column(name = "LowStockIndicator")
    private Long lowStockIndicator;

    @Column(name = "PRICE")
    private double price;

    public Stock() {}

    private Stock(StockBuilder stockBuilder) {
        this.cantidadVencimiento = stockBuilder.cantidad;
        this.product = stockBuilder.product;
        this.vencimiento = stockBuilder.vencimiento;
        this.lowStockIndicator = stockBuilder.lowStockIndicator;
        this.price = stockBuilder.price;
    }

    public static StockBuilder create(long cantidad) {
        return new StockBuilder(cantidad);
    }

    public Long getId() {
        return stock_ID;
    }

    public Date getExpirationDate() {
        return vencimiento;
    }

    public Long getCantidadVencimiento() {
        return cantidadVencimiento;
    }

    public void setCantidadVencimiento(Long cantidadVencimiento) {
        this.cantidadVencimiento = cantidadVencimiento;
    }

    public Long getLowStockIndicator() {
        return lowStockIndicator;
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

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    // Not being used for now
    public String asJson() {
        Gson gson = new Gson();
        return gson.toJson(this);
    }

    public Long getInventario_ID() {
        return inventario.getInventario_ID();
    }

    public static class StockBuilder {
        private final long cantidad;
        private Product product;
        private Date vencimiento;
        private Long lowStockIndicator;
        private double price;
        public StockBuilder(long cantidad) {
            this.cantidad = cantidad;
        }

        public StockBuilder setProduct(Product product) {
            this.product = product;
            return this;
        }

        public StockBuilder setExpiration(Date vencimiento) {
            this.vencimiento = vencimiento;
            return this;
        }

        public StockBuilder setLowStockIndicator(Long lowStockIndicator) {
            this.lowStockIndicator = lowStockIndicator;
            return this;
        }

        public Stock build() {
            return new Stock(this);
        }

        public StockBuilder setPrice(double price) {
            this.price = price;
            return this;
        }
    }
}