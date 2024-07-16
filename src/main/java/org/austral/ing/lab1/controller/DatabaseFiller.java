package org.austral.ing.lab1.controller;

import org.austral.ing.lab1.repository.inventories.Inventories;
import org.austral.ing.lab1.repository.inventories.products.Categories;
import org.austral.ing.lab1.repository.inventories.products.Products;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import java.util.List;

public class DatabaseFiller {
    private final EntityManagerFactory entityManagerFactory;

    public DatabaseFiller(EntityManagerFactory entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

    public void init() {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
//        createCategories(entityManager);
//        createProducts(entityManager);
//        addStocks(entityManager);
    }

    public void createCategories(EntityManager entityManager) {
        List<String> categoryNames = List.of(
                "Lacteos", "Grasas y Aceites", "Helados Comestibles", "Frutas y Verduras", "Confiteria", "Cereales", "Panaderia", "Carne", "Pesca",
                "Huevos", "Edulcorantes", "Condimentos", "Bebidas", "Nutricion Especial", "Alimentos Conservados"
        );

        Categories categories = new Categories(entityManager);

        for (String categoryName : categoryNames) {
            entityManager.getTransaction().begin();
            categories.createCategory(categoryName);
            entityManager.getTransaction().commit();
        }
    }

    public void createProducts(EntityManager entityManager) {
        Products products = new Products(entityManager);
        List<String> categoryNames = List.of(
                "Lacteos", "Grasas y Aceites", "Helados Comestibles", "Frutas y Verduras", "Confiteria", "Cereales", "Panaderia", "Carne", "Pesca",
                "Huevos", "Edulcorantes", "Condimentos", "Bebidas", "Nutricion Especial", "Alimentos Conservados"
        );
        List<List<String>> allProductNames = List.of(
            List.of("Leche", "Queso", "Yogur", "Mantequilla", "Crema", "Leche de Almendra", "Queso Cottage", "Crema Agria", "Crema Batida", "Margarina"),
            List.of("Aceite de Oliva", "Aceite de Girasol", "Aceite de Palma", "Aceite de Coco", "Aceite de Canola", "Aceite de Soja", "Aceite de Maiz", "Aceite de Sesamo", "Aceite de Cacahuete", "Aceite de Algodon"),
            List.of("Helado", "Sorbete", "Gelato", "Yogur Congelado", "Sherbet", "Granita", "Leche Helada", "Custard Congelado", "Pudin Congelado", "Mousse Congelado"),
            List.of("Manzana", "Platano", "Naranja", "Uva", "Fresa", "Arandano", "Frambuesa", "Mora", "Pina", "Mango"),
            List.of("Chocolate", "Caramelo", "Goma de Mascar", "Regaliz", "Toffee", "Chicle", "Dulce de Azucar", "Malvavisco", "Nougat", "Taffy"),
            List.of("Arroz", "Trigo", "Maiz", "Cebada", "Avena", "Centeno", "Mijo", "Sorgo", "Triticale", "Alforfon"),
            List.of("Pan", "Bagel", "Croissant", "Muffin", "Donut", "Roll", "Galleta", "Scone", "Panqueque", "Gofre"),
            List.of("Carne de Res", "Cerdo", "Pollo", "Pavo", "Pato", "Ganso", "Cordero", "Carnero", "Ternera", "Venado"),
            List.of("Salmon", "Atun", "Bacalao", "Trucha", "Merluza", "Arenque", "Sardina", "Anchoa", "Caballa", "Abadejo"),
            List.of("Huevo de Gallina", "Huevo de Pato", "Huevo de Ganso", "Huevo de Codorniz", "Huevo de Pavo", "Huevo de Avestruz", "Huevo de Emu", "Huevo de Nandu", "Huevo de Gallina de Guinea", "Huevo de Faisan"),
            List.of("Azucar", "Miel", "Jarabe de Arce", "Nectar de Agave", "Stevia", "Aspartamo", "Sucralosa", "Sacarina", "Acesulfamo de Potasio", "Monje de Fruta"),
            List.of("Ketchup", "Mostaza", "Mayonesa", "Salsa de Soja", "Vinagre", "Relish", "Salsa Barbacoa", "Salsa Picante", "Salsa Worcestershire", "Salsa de Pescado"),
            List.of("Agua", "Cafe", "Te", "Batido", "Jugo", "Soda", "Cerveza", "Vino", "Licor", "Coctel")
        );
        List<List<String>> allBrands = List.of(
                List.of("Dairyland", "Lactalis", "Danone", "Chobani", "Fage", "Yoplait", "Kraft", "Sargento", "Philadelphia", "Anchor"), // For Dairy
                List.of("Filippo Berio", "Bertolli", "Mazola", "Crisco", "Wesson", "Spectrum", "Sunflower", "Pam", "King", "LouAna"), // For Fats and Oils
                List.of("Ben & Jerry's", "Haagen-Dazs", "Breyers", "Magnum", "Cornetto", "Blue Bunny", "Dreyer's", "Talenti", "Gelato Fiasco", "Turkey Hill"), // For Edible Ices
                List.of("Dole", "Chiquita", "Del Monte", "Sunkist", "Driscoll’s", "Green Giant", "Fresh Express", "Earthbound Farm", "Bolthouse Farms", "Sun World"), // For Fruits and Vegetables
                List.of("Mars", "Hershey's", "Cadbury", "Nestle", "Lindt", "Ferrero Rocher", "Ghirardelli", "Godiva", "Toblerone", "Haribo"), // For Confectionery
                List.of("Quaker", "Kellogg's", "General Mills", "Post", "Nature's Path", "Bob's Red Mill", "Weetabix", "Alpen", "Cheerios", "Shredded Wheat"), // For Cereals
                List.of("Pepperidge Farm", "Sara Lee", "Thomas'", "Pillsbury", "King Arthur", "Entenmann's", "Arnold", "Dave's Killer Bread", "St Pierre", "Bimbo"), // For Bakery
                List.of("Tyson", "Perdue", "Smithfield", "Oscar Mayer", "Hormel", "Foster Farms", "Butterball", "Cargill", "JBS", "Maple Leaf"), // For Meat
                List.of("Gorton's", "Bumble Bee", "Chicken of the Sea", "StarKist", "Red Lobster", "High Liner", "SeaPak", "Wild Planet", "Marine Harvest", "Trident Seafoods"), // For Fishery
                List.of("Eggland's Best", "Cal-Maine Foods", "Sunny Farms", "Land O' Lakes", "Nellie's Free Range Eggs", "Pete and Gerry's", "Happy Egg Co.", "Organic Valley", "Vital Farms", "Wilcox Farms"), // For Eggs
                List.of("Domino", "C&H", "Tate & Lyle", "Wholesome", "Truvia", "Splenda", "Stevia in the Raw", "Monk Fruit in the Raw", "Equal", "Sweet'N Low"), // For Sweeteners
                List.of("Heinz", "French's", "Hellmann's", "Kikkoman", "Tabasco", "Hidden Valley", "Kraft", "Lea & Perrins", "Sriracha", "Frank's RedHot"), // For Condiments
                List.of("Coca-Cola", "Pepsi", "Nestle", "Red Bull", "Monster", "Gatorade", "Tropicana", "Lipton", "Starbucks", "Keurig") // For Beverages
        );

        List<List<String>> allQuantityTypes = List.of(
                List.of("Litros", "Unidades", "Unidades", "Unidades", "Litros", "Unidades", "Unidades", "Unidades", "Unidades", "Unidades"), // For Dairy
                List.of("Litros", "Litros", "Litros", "Litros", "Litros", "Litros", "Litros", "Litros", "Litros", "Litros"), // For Fats and Oils
                List.of("Unidades", "Unidades", "Unidades", "Unidades", "Unidades", "Unidades", "Unidades", "Unidades", "Unidades", "Unidades"), // For Edible Ices
                List.of("Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos"), // For Fruits and Vegetables
                List.of("Gramos", "Gramos", "Gramos", "Gramos", "Gramos", "Gramos", "Gramos", "Gramos", "Gramos", "Gramos"), // For Confectionery
                List.of("Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos"), // For Cereals
                List.of("Unidades", "Unidades", "Unidades", "Unidades", "Unidades", "Unidades", "Unidades", "Unidades", "Unidades", "Unidades"), // For Bakery
                List.of("Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos"), // For Meat
                List.of("Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos", "Kilogramos"), // For Fishery
                List.of("Unidades", "Unidades", "Unidades", "Unidades", "Unidades", "Unidades", "Unidades", "Unidades", "Unidades", "Unidades"), // For Eggs
                List.of("Gramos", "Litros", "Litros", "Litros", "Gramos", "Gramos", "Gramos", "Gramos", "Gramos", "Gramos"), // For Sweeteners
                List.of("Unidades", "Unidades", "Unidades", "Unidades", "Unidades", "Unidades", "Unidades", "Unidades", "Unidades", "Unidades"), // For Condiments
                List.of("Litros", "Litros", "Litros", "Unidades", "Unidades", "Litros", "Litros", "Litros", "Unidades", "Unidades") // For Beverages
        );
        for (int i = 0; i < categoryNames.size() - 2; i++) {
            for (int j = 0; j < allProductNames.get(i).size(); j++) {
                entityManager.getTransaction().begin();
                products.createProduct2(allProductNames.get(i).get(j), allBrands.get(i).get(j), allQuantityTypes.get(i).get(j), categoryNames.get(i));
                entityManager.getTransaction().commit();
            }
        }
    }

    public void addStocks(EntityManager entityManager)  {
        Inventories inventories = new Inventories(entityManager);
        List<String> productNames = List.of(
            "Leche", "Queso", "Yogur", "Mantequilla", "Crema", "Leche de Almendra", "Queso Cottage", "Crema Agria", "Crema Batida", "Margarina",
            "Aceite de Oliva", "Aceite de Girasol", "Aceite de Palma", "Aceite de Coco", "Aceite de Canola", "Aceite de Soja", "Aceite de Maiz", "Aceite de Sesamo", "Aceite de Cacahuete", "Aceite de Algodon",
            "Helado", "Sorbete", "Gelato", "Yogur Congelado", "Sherbet", "Granita", "Leche Helada", "Custard Congelado", "Pudin Congelado", "Mousse Congelado",
            "Manzana", "Platano", "Naranja", "Uva", "Fresa", "Arandano", "Frambuesa", "Mora", "Pina", "Mango",
            "Chocolate", "Caramelo", "Goma de Mascar", "Regaliz", "Toffee", "Chicle", "Dulce de Azucar", "Malvavisco", "Nougat", "Taffy"
        );
        List<Long> quantities = List.of(
                100L, 50L, 200L, 300L, 150L, 120L, 80L, 90L, 60L, 110L,
                70L, 40L, 130L, 140L, 160L, 95L, 85L, 75L, 65L, 55L,
                45L, 35L, 25L, 15L, 105L, 115L, 125L, 135L, 145L, 155L,
                165L, 175L, 185L, 195L, 205L, 215L, 225L, 235L, 245L, 255L,
                265L, 275L, 285L, 295L, 305L, 315L, 325L, 335L, 345L, 355L
        );
        List<Long> lowStocks = List.of(
                10L, 20L, 15L, 12L, 18L, 14L, 16L, 11L, 19L, 13L,
                17L, 9L, 21L, 22L, 23L, 24L, 25L, 26L, 27L, 28L,
                29L, 30L, 31L, 32L, 33L, 34L, 35L, 36L, 37L, 38L,
                39L, 40L, 41L, 42L, 43L, 44L, 45L, 46L, 47L, 48L,
                49L, 50L, 51L, 52L, 53L, 54L, 55L, 56L, 57L, 58L
        );
        List<Long> prices = List.of(
                1L, 2L, 3L, 4L, 5L, 6L, 7L, 8L, 9L, 10L,
                11L, 12L, 13L, 14L, 15L, 16L, 17L, 18L, 19L, 20L,
                21L, 22L, 23L, 24L, 25L, 26L, 27L, 28L, 29L, 30L,
                31L, 32L, 33L, 34L, 35L, 36L, 37L, 38L, 39L, 40L,
                41L, 42L, 43L, 44L, 45L, 46L, 47L, 48L, 49L, 50L
        );
        List<String> expirationDates = List.of(
                "16/07/2024", "17/07/2024", "18/07/2024", "19/07/2024", "20/07/2024",
                "21/07/2024", "22/07/2024", "23/07/2024", "24/07/2024", "25/07/2024",
                "31/07/2024", "01/08/2024", "02/08/2024", "03/08/2024", "04/08/2024",
                "05/08/2024", "06/08/2024", "07/08/2024", "08/08/2024", "09/08/2024",
                "10/08/2024", "11/08/2024", "12/08/2024", "13/08/2024", "14/08/2024",
                "15/08/2024", "16/08/2024", "17/08/2024", "18/08/2024", "19/08/2024",
                "20/08/2024", "21/08/2024", "22/08/2024", "23/08/2024", "24/08/2024",
                "25/08/2024", "26/08/2024", "27/08/2024", "28/08/2024", "29/08/2024",
                "30/08/2024", "31/08/2024", "01/09/2024", "02/09/2024", "03/09/2024",
                "04/09/2024", "05/09/2024", "06/09/2024", "07/09/2024", "08/09/2024"
        );
        for (int i = 0; i < productNames.size(); i++) {
            entityManager.getTransaction().begin();
            inventories.addStockToHouse2(1L, productNames.get(i), quantities.get(i), expirationDates.get(i), lowStocks.get(i), prices.get(i) * 1000);
            entityManager.getTransaction().commit();
        }
    }
}
