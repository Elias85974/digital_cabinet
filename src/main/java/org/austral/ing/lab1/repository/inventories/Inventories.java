package org.austral.ing.lab1.repository.inventories;

import org.austral.ing.lab1.model.house.House;
import org.austral.ing.lab1.model.inventory.Inventory;
import org.austral.ing.lab1.model.inventory.product.Category;
import org.austral.ing.lab1.model.inventory.product.Product;
import org.austral.ing.lab1.model.inventory.Stock;
import org.austral.ing.lab1.object.jsonparsable.ProductInfo;
import org.austral.ing.lab1.object.jsonparsable.ProductTotalInfo;
import org.austral.ing.lab1.repository.houses.LivesIns;

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

        // Calculate the total quantity, find the nearest expiration date, and calculate the average price
        Long totalQuantity = 0L;
        Date nearestExpirationDate = null;
        double totalValue = 0.0;
        Long lowStockIndicator = 0L;
        for (Stock s : sameProductStocks) {
            totalQuantity += s.getCantidadVencimiento();
            totalValue += s.getPrice();
            lowStockIndicator = s.getLowStockIndicator();
            if (nearestExpirationDate == null || s.getExpirationDate().before(nearestExpirationDate)) {
                nearestExpirationDate = s.getExpirationDate();
            }
        }

        // Create a new ProductInfo object with the calculated values
        return new ProductInfo(product, totalQuantity, nearestExpirationDate, totalValue, product.getCategory().getNombre(),lowStockIndicator);
    }

    public Inventory persist(Inventory inventory) {
        entityManager.persist(inventory);
        return inventory;
    }

    public void addStockToHouse(House house, Product product, Long quantity, Date expiration, Long lowStockIndicator, double price) {
        final Stock stock = Stock.create(quantity).setProduct(product).setExpiration(expiration)
                .setLowStockIndicator(lowStockIndicator).setPrice(price).build();
        entityManager.persist(stock);

        // Add the new stock to the house's inventory
        Inventory inventario = house.getInventario();
        inventario.addStock(stock);
        stock.setInventario(inventario);

        // If the Stock entity is still managed, this persist call might not be necessary (to check later jeje)
        entityManager.persist(stock);
        entityManager.persist(inventario);
        entityManager.persist(house);

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

    public List<ProductInfo> getLowOnStockProducts(Long houseId) {
        // Get the house
        House house = entityManager.find(House.class, houseId);

        // Get the inventory of the house
        Inventory inventory = house.getInventario();

        // Get the stocks of the inventory
        List<Stock> stocks = inventory.getStocks();

        // Create a map to store the total quantity of each product
        Map<Product, Long> productQuantities = new HashMap<>();

        // Create a map to store the nearest expiration date of each product
        Map<Product, Date> productExpirationDates = new HashMap<>();

        // Create a map to store the low stock limit of each product
        Map<Product, Long> productLowStockLimits = new HashMap<>();

        // Create a map to store the total value of each product
        Map<Product, Double> productTotalValues = new HashMap<>();

        // Create a map to store the category of each product
        Map<Product, String> productCategories = new HashMap<>();

        // Iterate over the stocks
        for (Stock stock : stocks) {
            Product product = stock.getProduct();
            Long quantity = stock.getCantidadVencimiento();
            Date expirationDate = stock.getExpirationDate();
            Category category = product.getCategory();

            // Update the total quantity of the product
            productQuantities.put(product, productQuantities.getOrDefault(product, 0L) + quantity);

            // Update the nearest expiration date of the product
            if (!productExpirationDates.containsKey(product) || productExpirationDates.get(product).after(expirationDate)) {
                productExpirationDates.put(product, expirationDate);
            }

            // Update the low stock limit of the product
            productLowStockLimits.put(product, stock.getLowStockIndicator());

            // Update the total value of the product
            productTotalValues.put(product, productTotalValues.getOrDefault(product, 0.0) + stock.getPrice() * quantity);

            // Update the category of the product
            productCategories.put(product, category.getNombre());
        }

        // Create a list to store the products that are low on stock
        List<ProductInfo> lowOnStockProducts = new ArrayList<>();

        // Iterate over the products
        for (Product product : productQuantities.keySet()) {
            // Check if the total quantity of the product is lower than the low stock limit
            if (productQuantities.get(product) <= productLowStockLimits.get(product)) {
                // Calculate the average price of the product
                double averagePrice = productQuantities.get(product) > 0 ? productTotalValues.get(product) / productQuantities.get(product) : 0;

                // Add the product to the list of low on stock products
                lowOnStockProducts.add(new ProductInfo(product, productQuantities.get(product), productExpirationDates.get(product), averagePrice, productCategories.get(product), productLowStockLimits.get(product)));
            }
        }

        return lowOnStockProducts;
    }

    // Get all the products in stock
    public List<ProductTotalInfo> getStockProducts(Long houseId) {
        // Get the house
        House house = entityManager.find(House.class, houseId);

        // Get the inventory of the house
        Inventory inventory = house.getInventario();

        // Get the stocks of the inventory
        List<Stock> stocks = inventory.getStocks();

        // Create a map to store the total quantity of each product
        Map<Product, Long> productQuantities = new HashMap<>();

        // Create a map to store the nearest expiration date of each product
        Map<Product, Date> productExpirationDates = new HashMap<>();

        // Create a map to store the low stock limit of each product
        Map<Product, Long> productLowStockLimits = new HashMap<>();

        // Create a map to store the total value of each product
        Map<Product, Double> productTotalValues = new HashMap<>();

        // Iterate over the stocks
        for (Stock stock : stocks) {
            Product product = stock.getProduct();
            Long quantity = stock.getCantidadVencimiento();
            Date expirationDate = stock.getExpirationDate();
            Long lowStockIndicator = stock.getLowStockIndicator();

            // Update the total quantity of the product
            productQuantities.put(product, productQuantities.getOrDefault(product, 0L) + quantity);

            // Update the nearest expiration date of the product
            if (!productExpirationDates.containsKey(product) || productExpirationDates.get(product).after(expirationDate)) {
                productExpirationDates.put(product, expirationDate);
            }

            // Update the low stock limit of the product
            productLowStockLimits.put(product, lowStockIndicator);

            // Update the total value of the product
            productTotalValues.put(product, productTotalValues.getOrDefault(product, 0.0) + stock.getPrice() * quantity);
        }

        // Create a list to store the products that are low on stock
        List<ProductTotalInfo> stockProducts = new ArrayList<>();

        // Iterate over the products
        for (Product product : productQuantities.keySet()) {
            if (productQuantities.get(product) < productLowStockLimits.get(product) || productQuantities.get(product) > productLowStockLimits.get(product) || Objects.equals(productQuantities.get(product), productLowStockLimits.get(product))) {

                // Calculate the average price of the product
                double averagePrice = productQuantities.get(product) > 0 ? productTotalValues.get(product) / productQuantities.get(product) : 0;

                // Add the product to the list of low on stock products
                stockProducts.add(new ProductTotalInfo(product, productQuantities.get(product), productExpirationDates.get(product), productLowStockLimits.get(product), averagePrice));
            }
        }

        return stockProducts;
    }

    // Add stock to the last added stock of the product
    public void quickStockAdding(Long houseId, Long productId, Long quantity) {
        // Get the house
        House house = entityManager.find(House.class, houseId);

        // Get the inventory of the house
        Inventory inventory = house.getInventario();

        // Get the stocks of the inventory
        List<Stock> stocks = inventory.getStocks();

        // Filter the stocks to get the ones for the given product
        List<Stock> productStocks = stocks.stream()
                .filter(stock -> stock.getProduct().getProducto_ID().equals(productId))
                .collect(Collectors.toList());

        // Sort the stocks by expiration date in descending order
        productStocks.sort(Comparator.comparing(Stock::getExpirationDate).reversed());

        // Get the last stock inserted (the one with the farthest expiration date)
        Stock lastStockInserted = productStocks.get(0);

        // Add the quantity to the last stock inserted
        lastStockInserted.setCantidadVencimiento(lastStockInserted.getCantidadVencimiento() + quantity);

        // Set the price of the new stock to the last inserted stock's price
        lastStockInserted.setPrice(lastStockInserted.getPrice());

        // Persist the updated stock
        entityManager.persist(lastStockInserted);
    }

    public Map<String, Double> getValueByCategory(Inventory inventory) {
        // Get the stocks of the inventory
        List<Stock> stocks = inventory.getStocks();

        // Create a map to store the total value of each category
        Map<String, Double> valueByCategory = new HashMap<>();

        // Iterate over the stocks
        for (Stock stock : stocks) {
            Product product = stock.getProduct();
            String category = product.getCategory().getNombre();
            double value = stock.getPrice();

            // Update the total value of the category
            valueByCategory.put(category, valueByCategory.getOrDefault(category, 0.0) + value);
        }

        return valueByCategory;
    }

    // Get the products with low stock by category
    public List<ProductInfo> getLowOnStockProductsByCategory(Long inventoryId, String category) {
        // Obtén los productos con bajo stock como antes
        List<ProductInfo> lowStockProducts = getLowOnStockProducts(inventoryId);

        // Filtra los productos por la categoría proporcionada
        List<ProductInfo> filteredProducts = new ArrayList<>();
        for (ProductInfo productInfo : lowStockProducts) {
            if (productInfo.getCategory().equals(category)) {
                filteredProducts.add(productInfo);
            }
        }

        return filteredProducts;
    }
}
