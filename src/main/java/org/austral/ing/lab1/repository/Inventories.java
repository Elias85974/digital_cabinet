package org.austral.ing.lab1.repository;

import org.austral.ing.lab1.model.*;
import org.austral.ing.lab1.object.ProductInfo;
import org.jetbrains.annotations.NotNull;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import java.util.*;
import java.util.stream.Collectors;

public class Inventories {
    private final EntityManager entityManager;

    public Inventories(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Optional<Inventory> getFromId(Long id) {
        return Optional.ofNullable(entityManager.find(Inventory.class, id));
    }

    public List<ProductInfo> getProductsByCategory(Long inventoryId, String category) {
    Inventory inventory = entityManager.find(Inventory.class, inventoryId);
    if (inventory != null) {
        // Group the stocks by product
        Map<Product, List<Stock>> productStocksMap = inventory.getStocks().stream()
                .filter(stock -> stock.getProduct().getCategory().getNombre().equals(category))
                .filter(stock -> stock.getCantidadVencimiento() != 0) // Ignore stocks with a quantity of 0
                .collect(Collectors.groupingBy(Stock::getProduct));

        List<ProductInfo> products = new ArrayList<>();
        for (Map.Entry<Product, List<Stock>> entry : productStocksMap.entrySet()) {
            ProductInfo productInfo = getProductInfo(entry);
            products.add(productInfo);
        }

        // Sort the products by total quantity in descending order
        products.sort((p1, p2) -> Long.compare(p2.getTotalQuantity(), p1.getTotalQuantity()));

        return products;
    } else {
        return null;
    }
}

        private ProductInfo getProductInfo(Map.Entry<Product, List<Stock>> entry) {
        Product product = entry.getKey();
        List<Stock> sameProductStocks = entry.getValue();

        // Calculate the total quantity and find the nearest expiration date
        Long totalQuantity = 0L;
        Date nearestExpirationDate = null;
        for (Stock s : sameProductStocks) {
            totalQuantity += s.getCantidadVencimiento();
            if (nearestExpirationDate == null || s.getExpirationDate().before(nearestExpirationDate)) {
                nearestExpirationDate = s.getExpirationDate();
            }
        }

        // Create a new ProductInfo object with the calculated values
        return new ProductInfo(product, totalQuantity, nearestExpirationDate);
    }

    public Inventory persist(Inventory inventory) {
        entityManager.persist(inventory);
        return inventory;
    }

    public void addStockToHouse(House house, Stock stock) {
        LivesIns livesIns = new LivesIns(entityManager);

        // Add the new stock to the house's inventory
        Inventory inventario = house.getInventario();
        inventario.addStock(stock);
        stock.setInventario(inventario);
        entityManager.persist(stock);
        entityManager.persist(inventario);
        entityManager.persist(house);
        /*
        // Update all LivesIn relationships linked to the house
        List<LivesIn> livesInsOfHouse = livesIns.getFromHouseId(house.getCasa_ID());
        for (LivesIn livesIn : livesInsOfHouse) {
            // Merge the LivesIn entity to persist the changes
            entityManager.merge(livesIn);
        }

         */
    }

    public void reduceStock(Long houseId, Long productId, Long quantity) {
    // Fetch the house from the database
    House house = entityManager.find(House.class, houseId);
    if (house != null) {
        // Fetch the stocks of the product in the house
        List<Stock> stocks = house.getInventario().getStocks().stream()
                .filter(stock -> stock.getProduct().getProducto_ID().equals(productId))
                .sorted(Comparator.comparing(Stock::getExpirationDate))
                .collect(Collectors.toList());

        // Start the transaction
        EntityTransaction tx = entityManager.getTransaction();
        tx.begin();

        // Iterate over the stocks and reduce the quantity
        for (Stock stock : stocks) {
            if (quantity <= 0) {
                break;
            }
            if (stock.getCantidadVencimiento() <= quantity) {
                quantity -= stock.getCantidadVencimiento();
                // Set the stock quantity to 0
                stock.setCantidadVencimiento(0L);
            } else {
                stock.setCantidadVencimiento(stock.getCantidadVencimiento() - quantity);
                quantity = 0L;
            }
            // Merge the stock entity to persist the changes
            entityManager.merge(stock);
        }

        // Remove all stocks with a quantity of 0
        stocks.stream()
            .filter(stock -> stock.getCantidadVencimiento() == 0)
            .forEach(stock -> {
                Stock managedStock = entityManager.find(Stock.class, stock.getId());
                if (managedStock != null) {
                    entityManager.remove(managedStock);
                }
            });

        // Commit the transaction
        tx.commit();
    }
}
}
