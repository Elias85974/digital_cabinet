package org.austral.ing.lab1.model.inventory;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import org.austral.ing.lab1.model.inventory.product.Category;
import org.austral.ing.lab1.model.house.House;
import org.austral.ing.lab1.model.inventory.product.Product;
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

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Stock> stocks;

    public Inventory() {
        this.stocks = new ArrayList<>();
    }

    public void setID(Long inventarioId) {
        this.inventario_ID = inventarioId;
    }

    public void setHouse(House casa) {
        this.casa = casa;
    }

    public Long getInventario_ID() {
        return inventario_ID;
    }

    public Inventory getInventory() {
        return this;
    }

    public void addStock(Stock stock) {
        if (!stocks.contains(stock)) {
            stocks.add(stock);
        }
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

            // Access the products collection while the session is still open
            // Hibernate.initialize(product.getCategory().getProducts());

            productsByCategory.get(category).add(product);
        }

        Gson gson = new GsonBuilder()
                .registerTypeAdapter(Product.class, new Product.ProductSerializer())
                .create();
        return gson.toJson(productsByCategory);
    }

    public String getCategoriesAsJson() {
        List<String> categories = new ArrayList<>();
        for (Stock stock : stocks) {
            Product product = stock.getProduct();
            Category category = product.getCategory();
            if (!categories.contains(category.getNombre())) {
                categories.add(category.getNombre());
            }
        }
        Gson gson = new Gson();
        return gson.toJson(categories);
    }
}