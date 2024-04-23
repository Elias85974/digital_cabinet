package org.austral.ing.lab1.model;

import com.google.gson.Gson;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "INVENTORY")
public class Inventory {
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private Long inventario_ID;

    @OneToOne
    @JoinColumn(name = "CASA_ID", referencedColumnName = "CASA_ID")
    private House casa;

    @OneToMany(mappedBy = "inventario", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Stock> stocks;

    public Inventory() {
        this.stocks = new ArrayList<>();
    }

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

    public void setCasa(House casa) {
        this.casa = casa;
    }

    public void addStock(Stock stock) {
        stocks.add(stock);
    }

    public List<Stock> getStocks() {
        return stocks;
    }

    public String asJson() {
        Map<String, List<Product>> productsByCategory = new HashMap<>();

        for (Stock stock : stocks) {
            Product product = stock.getProduct();
            String category = product.getCategory().getNombre();

            if (!productsByCategory.containsKey(category)) {
                productsByCategory.put(category, new ArrayList<>());
            }

            productsByCategory.get(category).add(product);
        }

        return new Gson().toJson(productsByCategory);
    }
}