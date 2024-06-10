package org.austral.ing.lab1;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import org.austral.ing.lab1.model.*;
import org.austral.ing.lab1.model.livesIn.LivesIn;
import org.austral.ing.lab1.model.User;
import org.austral.ing.lab1.object.Invitation;
import org.austral.ing.lab1.repository.*;
import org.austral.ing.lab1.model.Product;
import org.austral.ing.lab1.repository.Products;
import org.austral.ing.lab1.model.Category;
import org.austral.ing.lab1.repository.Categories;
import org.austral.ing.lab1.model.Inbox;
import org.austral.ing.lab1.repository.Inboxes;
import org.austral.ing.lab1.repository.Users;
import org.austral.ing.lab1.repository.Houses;

import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static spark.Spark.halt;

//import org.austral.ing.lab1.TokenResponse;

public class Application {

    private static final Gson gson = new Gson();

    public static void main(String[] args) {

        final EntityManagerFactory entityManagerFactory = Persistence.createEntityManagerFactory("lab1");

        Spark.port(4321);

        // Commenting the lines of testing methods
        // storedBasicUser(entityManagerFactory);
        // makeAnUserLiveInAHouse(entityManagerFactory);

        /* 5. Dynamic Content from Db */
        Spark.get("/persisted-users/:id",
            (req, resp) -> {
                final String id = req.params("id");

                /* Business Logic */
                final EntityManager entityManager = entityManagerFactory.createEntityManager();
                final EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                User user = entityManager.find(User.class, Long.valueOf(id));
                tx.commit();
                entityManager.close();

                resp.type("application/json");
                return user.asJson();
            }
        );

        // Route to create a user
        Spark.post("/users", "application/json", (req, resp) -> {
            try {
                final User user = User.fromJson(req.body());
                final WishList wishList = new WishList();

                /* Begin Business Logic */
                final EntityManager entityManager = entityManagerFactory.createEntityManager();
                final Users users = new Users(entityManager);
                final WishLists wishLists = new WishLists(entityManager);
                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                wishList.setUser(user);
                user.setWishList(wishList);
                users.persist(user);
                wishLists.persist(wishList);
                resp.type("application/json");
                resp.status(201);
                tx.commit();
                entityManager.close();
                /* End Business Logic */

                return user.asJson();
            }
            catch (Exception e) {
                resp.status(500);
                System.out.println(e.getMessage());
                return "An error occurred while creating the user, please try again";
            }
        });

        // Requesting a login with a user
        Spark.post("/login", "application/json", (req, resp) -> {
            final User user = User.fromJson(req.body());
            String body = req.body();
            Map<String, String> formData = gson.fromJson(body, new TypeToken<Map<String, String>>() {}.getType());
            String email = formData.get("mail");
            String password = formData.get("password");
            /* Begin Business Logic */
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Users users = new Users(entityManager);
            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            Optional<User> foundUserOptional = users.findByEmail(user.getMail());
            tx.commit();
            entityManager.close();
            /* End Business Logic */

            if (foundUserOptional.isEmpty()) {
                resp.status(404);
                return "User not found";
            }

            User foundUser = foundUserOptional.get();

            //User user = foundUserOptional.get();
            if (foundUser.getPassword().equals(password)) {
                //String token = TokenResponse.generateToken(email);

                // Crear un objeto JSON con el token, el tipo de usuario y el correo electrónico
                JsonObject jsonResponse = new JsonObject();
                //jsonResponse.addProperty("token", token);
                jsonResponse.addProperty("email", email); // Correo electrónico del usuario

                // Establecer el encabezado Content-Type
                resp.type("application/json");

                // Establecer el encabezado Authorization con el token en el formato Bearer
                //resp.header("Authorization", "Bearer " + token);

                // Devolver el objeto JSON como cuerpo de la respuesta
                return jsonResponse.toString();
            }


            if (!foundUser.getPassword().equals(user.getPassword())) {
                resp.status(401);
                return "Invalid password";
            }

            return foundUser.asJson();
        });

        // Requesting a list of all users
        Spark.get("/listUsers", (req, resp) -> {
            /* Begin Business Logic */
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Users users = new Users(entityManager);
            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            final String json = gson.toJson(users.listAll());
            tx.commit();
            entityManager.close();
            /* End Business Logic */

            resp.type("application/json");
            return json;
        });

        // Method to validate a token
//        Spark.post("/auth", "application/json", (req, resp) -> {
//            String token = req.headers("Token");
//            String mail = req.headers("Email");
//            if (token == null) {
//                halt(401, "No token provided");
//            } else {
//                try {
//                    //boolean status = TokenResponse.isAuthorized(token, mail);
//                    if (!status) {
//                        resp.status(401);
//                    }
//                    else {
//                        resp.status(200);
//                    }
//                } catch (Exception e) {
//                    halt(401, "Failed to authenticate");
//                }
//            }
//            return resp;
//        });

        /*const verifyJWT = (req, resp, next) => {
            const token = req.headers("x-access-token");
            if (!token) {
                res.send("No token provided");
            } else{
                jwt.veify(token, "secret", (err, decoded) => {
                    if (err) {
                        res.json(auth: false, message: "Failed to authenticate");
                    } else {
                        req.userId = decoded.id;
                        next();
                    }
                });
            }
        }
        app.get("/isUserAuthenticated", verifyJWT, (req, resp) -> {
            resp.send("Authenticated");
        });
        Spark.before("/isUserAuthenticated", (req, resp) -> {
            String token = req.headers("x-access-token");
            if (token == null) {
                halt(401, "No token provided");
            } else {
                try {
                    Jwts.parserBuilder()
                            .setSigningKey(Keys.hmacShaKeyFor("secret".getBytes()))
                            .build()
                            .parseClaimsJws(token);
                } catch (Exception e) {
                    halt(401, "Failed to authenticate");
                }
            }
        });

        Spark.get("/isUserAuthenticated", (req, resp) -> {
            resp.status(200);
            resp.body("Authenticated");
            return null;
        });
        // Endpoint to refresh token
        Spark.post("/refreshToken", "application/json", (req, resp) -> {
            final String refreshToken = req.headers("x-refresh-token");

            // Validate refresh token
            try {
                Jwts.parserBuilder()
                        .setSigningKey(Keys.hmacShaKeyFor("refreshSecret".getBytes()))
                        .build()
                        .parseClaimsJws(refreshToken);
            } catch (Exception e) {
                halt(401, "Failed to authenticate refresh token");
            }

            // Generate new JWT and refresh token
            String newToken = Jwts.builder()
                    .setSubject("userId")
                    .setExpiration(new Date(System.currentTimeMillis() + 60 * 60 * 1000)) // 1 hour
                    .signWith(Keys.hmacShaKeyFor("secret".getBytes()))
                    .compact();

            String newRefreshToken = Jwts.builder()
                    .setSubject("userId")
                    .setExpiration(new Date(System.currentTimeMillis() +  60 * 60 * 1000)) // 1 day
                    .signWith(Keys.hmacShaKeyFor("refreshSecret".getBytes()))
                    .compact();

            // Send new tokens to client
            resp.status(200);
            resp.type("application/json");
            return gson.toJson(new TokenResponse(newToken, newRefreshToken));
        });*/


        // Route to create a house of a given user
        Spark.post("/houses/:userID", "application/json", (req, resp) -> {
            try {
                final Long userId = Long.valueOf(req.params("userID"));
                final EntityManager entityManager = entityManagerFactory.createEntityManager();
                Houses housesRepo = new Houses(entityManager);
                Inventories inventoriesRepo = new Inventories(entityManager);
                Users usersRepo = new Users(entityManager);
                final House house = House.fromJson(req.body());
                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                User user = usersRepo.findById(userId).get(); // Acá estamos seguros de que el usuario existe porque el token fue validado
                final Inventory inventory = new Inventory();
                inventoriesRepo.persist(inventory);
                house.setInventario(inventory);
                housesRepo.persist(house);
                inventory.setHouse(house);
                inventoriesRepo.persist(inventory);
                final LivesIn livesIn = LivesIn.create(user, house, true).build();
                entityManager.persist(livesIn);
                entityManager.refresh(user);
                resp.type("application/json");
                resp.status(201);
                tx.commit();
                // house.asJson();
                return resp;
            } catch (Exception e) {
                resp.status(500);
                return "An error occurred while creating the house, please try again";
            }
        });

        // Route to invite a user to my house
        Spark.post("/inviteUser/:email/:houseId", (req, resp) -> {
            String email = req.params("email");
            Long houseId = Long.valueOf(req.params("houseId"));

            // Begin Business Logic
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Users usersRepo = new Users(entityManager);
            final Houses housesRepo = new Houses(entityManager);
            final Inboxes inboxesRepo = new Inboxes(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();

            Optional<User> userOptional = usersRepo.findByEmail(email);
            Optional<House> houseOptional = housesRepo.findById(houseId);

            if (userOptional.isEmpty() || houseOptional.isEmpty()) {
                resp.status(404);
                return "User or House not found";
            }

            User user = userOptional.get();
            House house = houseOptional.get();

            Inbox inbox = new Inbox();
            inbox.setUser(user);
            inbox.setHouse(house);

            inboxesRepo.persist(inbox);

            tx.commit();
            entityManager.close();

            resp.status(201);
            return "Inbox created successfully";
        });

        // Route to get the inbox of a user
        Spark.get("/getInbox/:userId", (req, resp) -> {
            Long userId = Long.parseLong(req.params("userId"));

            // Begin Business Logic
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Inboxes inboxesRepo = new Inboxes(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();

            List<Long> houseIds = inboxesRepo.getHousesByUserId(userId);

            tx.commit();
            entityManager.close();

            resp.status(200);
            resp.type("application/json");
            return new Gson().toJson(houseIds);
        });

        // Route to process the invitations of a user
        Spark.post("/processInvitations", "application/json", (req, resp) -> {
            // Parse the JSON array from the request body
            List<Invitation> invitations = new Gson().fromJson(req.body(), new TypeToken<List<Invitation>>(){}.getType());

            // Begin Business Logic
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Users usersRepo = new Users(entityManager);
            final Houses housesRepo = new Houses(entityManager);
            final Inboxes inboxesRepo = new Inboxes(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();

            for (Invitation invitation : invitations) {
                Long userId = Long.parseLong(invitation.getUserId());
                Long houseId = Long.parseLong(invitation.getHouseId());
                boolean accepted = invitation.isAccepted();

                Optional<User> userOptional = usersRepo.findById(userId);
                Optional<House> houseOptional = housesRepo.findById(houseId);

                if (userOptional.isEmpty() || houseOptional.isEmpty()) {
                    resp.status(404);
                    return "User or House not found";
                }

                User user = userOptional.get();
                House house = houseOptional.get();

                // Remove the Inbox relation
                Inbox inbox = inboxesRepo.findByUserAndHouse(user, house);
                inboxesRepo.delete(inbox);

                // If the invitation is accepted, create the LivesIn relation
                if (accepted) {
                    LivesIn livesIn = new LivesIn();
                    livesIn.setUsuario(user);
                    livesIn.setCasa(house);
                    entityManager.persist(livesIn);
                }
            }

            tx.commit();
            entityManager.close();

            resp.status(200);
            return "Invitations processed successfully";
        });

        // Route to change the id a user lives in
        Spark.put("/houses/:houseId/users/:token", "application/json", (req, resp) -> {
            final String houseId = req.params("houseId");
            final String token = req.params("token");

            /* Begin Business Logic */
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Houses houses = new Houses(entityManager);
            final Users users = new Users(entityManager);
            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            final Optional<House> houseOptional = houses.findById(Long.valueOf(houseId));
            final Optional<User> userOptional = users.findByToken(token);
            tx.commit();
            entityManager.close();
            /* End Business Logic */

            if (houseOptional.isEmpty()) {
                resp.status(404);
                return "Id not found";
            }

            if (userOptional.isEmpty()) {
                resp.status(404);
                return "User not found";
            }

            final House house = houseOptional.get();
            final User user = userOptional.get();

            /* Begin Business Logic */
            final EntityManager entityManager2 = entityManagerFactory.createEntityManager();
            final LivesIns livesIns = new LivesIns(entityManager2);
            EntityTransaction tx2 = entityManager2.getTransaction();
            tx2.begin();
            final LivesIn livesIn = LivesIn.create(user, house, true).build();
            livesIns.persist(livesIn);
            tx2.commit();
            entityManager2.close();
            /* End Business Logic */

            return "User now lives in the house";
        });

        // Requesting an inventory of a house
        Spark.get("/houses/:houseId/inventory", (req, resp) -> {
            final String houseId = req.params("houseId");

            /* Begin Business Logic */
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Houses houses = new Houses(entityManager);
            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            final Optional<House> houseOptional = houses.findById(Long.valueOf(houseId));
            tx.commit();
            entityManager.close();
            /* End Business Logic */

            if (houseOptional.isEmpty()) {
                resp.status(404);
                return "House not exists";
            }

            final House house = houseOptional.get();
            final Inventory inventory = house.getInventario();
            String categories = inventory.getCategoriesAsJson();

            resp.type("application/json");
            return categories;
        });

        // Route to update the inventory of a given house
        Spark.put("/houses/:houseId/inventory/:productId/:quantity", "application/json", (req, resp) -> {
            final String houseId = req.params("houseId");
            final String productId = req.params("productId");
            final long cantidad = Long.parseLong(req.params("quantity"));

            /* Begin Business Logic */
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Houses houses = new Houses(entityManager);
            final Products products = new Products(entityManager);
            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            final Optional<House> houseOptional = houses.findById(Long.valueOf(houseId));
            final Optional<Product> productOptional = products.findById(Long.valueOf(productId));

            /* End Business Logic */

            if (houseOptional.isEmpty()) {
                resp.status(404);
                return "House not found";
            }

            if (productOptional.isEmpty()) {
                resp.status(404);
                return "Product not found";
            }

            final House house = houseOptional.get();
            Product product = productOptional.get();
            final Stock stock = Stock.create(cantidad).setProduct(product).build();

            /* Begin Business Logic */
            final Inventories inventories = new Inventories(entityManager);
            entityManager.persist(stock);
            inventories.addStockToHouse(house, stock);
            tx.commit();
            entityManager.close();
            /* End Business Logic */
            resp.status(200);
            return "Everything works fine";
        });

        // Route to get the filtered by categories products of a house
        Spark.get("/houses/:houseId/products/:category", (req, resp) -> {
            Long houseId = Long.parseLong(req.params("houseId"));
            String category = req.params("category");

            // Begin Business Logic
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Inventories inventoriesRepo = new Inventories(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();

            List<Product> products = inventoriesRepo.getProductsByCategory(houseId, category);

            tx.commit();
            entityManager.close();

            if (products != null) {
                resp.status(200);
                resp.type("application/json");
                return new Gson().toJson(products);
            } else {
                resp.status(404);
                return "House not found";
            }
        });

        // Route to get the products of the user's wishlist
        Spark.get("/wishList/:userId", (req, resp) -> {
            Long userId = Long.parseLong(req.params("userId"));

            // Begin Business Logic
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Users usersRepo = new Users(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();

            Optional<User> user = usersRepo.findById(userId);

            tx.commit();
            entityManager.close();

            if (user.isPresent()) {
                resp.status(200);
                resp.type("application/json");
                return user.get().getWishList().asJson();
            } else {
                resp.status(404);
                return "User not found";
            }
        });


        // Route to get all the products of the database
        Spark.get("/products", (req, resp) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            Products productsRepo = new Products(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
            String productsJson = gson.toJson(productsRepo.listAll());
            tx.commit();
            entityManager.close();

            resp.type("application/json");
            return productsJson;
        });

        // Route to create a product
        Spark.post("/products/:categoryId", "application/json", (req, resp) -> {
            try {
                final Long categoryId = Long.valueOf(req.params("categoryId"));
                final EntityManager entityManager = entityManagerFactory.createEntityManager();
                Products productsRepo = new Products(entityManager);
                Categories categoriesRepo = new Categories(entityManager);
                final Product product = Product.fromJson(req.body());
                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                Optional<Category> categoryOptional = categoriesRepo.findById(categoryId);
                product.setCategory(categoryOptional.get());
                productsRepo.persist(product);
                resp.type("application/json");
                resp.status(201);
                tx.commit();
                return product.asJson();
            } catch (Exception e) {
                resp.status(500);
                return "An error occurred while creating the product, please try again";
            }
        });

        // Route to get a product by name
        Spark.get("/products/:name", (req, resp) -> {
            final String name = req.params("name");

            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            Products productsRepo = new Products(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            Optional<Product> productOptional = productsRepo.findByName(name);
            tx.commit();

            if (productOptional.isPresent()) {
                resp.type("application/json");
                return productOptional.get().asJson();
            } else {
                resp.status(404);
                return "Product not found";
            }
        });

        // Route to update a product
        Spark.put("/products/:name", "application/json", (req, resp) -> {
            final String name = req.params("name");
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            Products productsRepo = new Products(entityManager);
            final Product newProductData = Product.fromJson(req.body());

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            Product updatedProduct = productsRepo.modify(name, newProductData);
            tx.commit();

            if (updatedProduct != null) {
                resp.type("application/json");
                return updatedProduct.asJson();
            } else {
                resp.status(404);
                return "Product not found";
            }
        });

        // Route to delete a product
        Spark.delete("/products/:name", (req, resp) -> {
            try {
                final String name = req.params("name");
                final EntityManager entityManager = entityManagerFactory.createEntityManager();
                Products productsRepo = new Products(entityManager);

                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                productsRepo.delete(name);
                tx.commit();

                resp.status(204);
                return "Product deleted";
            } catch (Exception e) {
                resp.status(500);
                return "An error occurred while deleting the product, please try again";
            }
        });

        // Route to get the existing categories
        Spark.get("/categories", (req, resp) -> {
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            Categories categoriesRepo = new Categories(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
            String categoriesJson = gson.toJson(categoriesRepo.listAll());
            tx.commit();
            entityManager.close();

            resp.type("application/json");
            return categoriesJson;
        });

        // Route to create a category
        Spark.post("/categories", "application/json", (req, resp) -> {
            try {
                final Category category = Category.fromJson(req.body());
                final EntityManager entityManager = entityManagerFactory.createEntityManager();
                Categories categoriesRepo = new Categories(entityManager);

                EntityTransaction tx = entityManager.getTransaction();
                tx.begin();
                categoriesRepo.persist(category);
                resp.type("application/json");
                resp.status(201);
                tx.commit();

                return category.asJson();
            } catch (Exception e) {
                resp.status(500);
                return "An error occurred while creating the category";
            }
        });

        /* Route to get a category by name
        Spark.get("/categories/:name", (req, resp) -> {
            final String name = req.params("name");
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            Categories categoriesRepo = new Categories(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            Optional<Category> categoryOptional = categoriesRepo.findByName(name);
            tx.commit();

            if (categoryOptional.isPresent()) {
                resp.type("application/json");
                return categoryOptional.get().asJson();
            } else {
                resp.status(404);
                return "Category not found";
            }
        });

         */

        // Route to update a category
        Spark.put("/categories/:name", "application/json", (req, resp) -> {
            final String name = req.params("name");
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            Categories categoriesRepo = new Categories(entityManager);
            final Category newCategoryData = Category.fromJson(req.body());

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            Category updatedCategory = categoriesRepo.modify(name, newCategoryData);
            tx.commit();

            if (updatedCategory != null) {
                resp.type("application/json");
                return updatedCategory.asJson();
            } else {
                resp.status(404);
                return "Category not found";
            }
        });

        // Route to delete a category
        Spark.delete("/categories/:name", (req, resp) -> {
            final String name = req.params("name");
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            Categories categoriesRepo = new Categories(entityManager);

            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            categoriesRepo.delete(name);
            tx.commit();

            resp.status(204);
            return "Category deleted";
        });

        Spark.options("/*", (req, res) -> {
            String accessControlRequestHeaders = req.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                res.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = req.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                res.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        Spark.before((req, res) -> {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "*");
            res.type("application/json");
        });


        // Route to get all the houses of a user
        Spark.get("/user/:userId/houses", (req, resp) -> {
            final String userId = req.params("userId");

            /* Begin Business Logic */
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Users users = new Users(entityManager);
            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            User user = entityManager.find(User.class, Long.valueOf(userId));
            tx.commit();
            entityManager.close();

            resp.type("application/json");
            return user.getHousesAsJson();
        });

        // Route to get the ID of a user by email
        Spark.get("/user/email/:email", (req, resp) -> {
            final String email = req.params("email");

            /* Business Logic */
            final EntityManager entityManager = entityManagerFactory.createEntityManager();
            final Users users = new Users(entityManager);
            EntityTransaction tx = entityManager.getTransaction();
            tx.begin();
            Optional<User> userOptional = users.findByEmail(email);
            tx.commit();
            entityManager.close();

            if (userOptional.isEmpty()) {
                resp.status(404);
                return "User not found";
            }

            User user = userOptional.get();

            resp.type("application/json");
            return user.getUsuario_ID().toString(); // Devuelve el ID del usuario como una cadena
        });



    }

    /*
    private static void storedBasicUser(EntityManagerFactory entityManagerFactory) {
        final EntityManager entityManager = entityManagerFactory.createEntityManager();
        final Users users = new Users(entityManager);

        EntityTransaction tx = entityManager.getTransaction();
        tx.begin();
        if (users.listAll().isEmpty()) {
            final User luke =
                    User.create("luke.skywalker@jedis.org")
                            .setFirstName("Luke")
                            .setLastName("Skywalker").
                            build();
            final User leia =
                    User.create("leia.skywalker@jedis.org")
                            .setFirstName("Leia")
                            .setLastName("Skywalker")
                            .build();

            users.persist(luke);
            users.persist(leia);
        }
        tx.commit();
        entityManager.close();
    }


    // This method creates a user, a house and a relationship between them, this was made for testing purposes
    private static void makeAnUserLiveInAHouse(EntityManagerFactory entityManagerFactory) {
        final EntityManager entityManager = entityManagerFactory.createEntityManager();
        final Users users = new Users(entityManager);
        final Inventories inventories = new Inventories(entityManager);

        EntityTransaction tx = entityManager.getTransaction();
        tx.begin();
        final User luke = User.create("lol").setFirstName("Luke").setLastName("SkyWalker").setPassword("123456").build();
        final Inventory inventory = createInventoryWithStocks(entityManagerFactory); // Create Inventory instance
        final House house = House.create(inventory).withDireccion("Calle Falsa 123").withNombre("Casa de Luke").build();
        // inventory.setHouse(house); // Set Id instance
        inventories.persist(inventory); // Persist Inventory instance
        final LivesIn livesIn = LivesIn.create(luke, house, true).build();
        entityManager.persist(luke);
        entityManager.persist(house);
        entityManager.persist(livesIn);
        tx.commit();
        entityManager.refresh(luke); // Refresh the User entity
        entityManager.close();
        System.out.println(luke.getLivesIns().get(0).getCasa().getDireccion());
        System.out.println(luke.getLivesIns().get(0).getCasa().getInventario_ID());
    }

    // This method creates an inventory with some Stocks, this was made for testing purposes
    private static Inventory createInventoryWithStocks(EntityManagerFactory entityManagerFactory) {
        final EntityManager entityManager = entityManagerFactory.createEntityManager();
        final Inventories inventories = new Inventories(entityManager);
        final Stocks stocks = new Stocks(entityManager);
        EntityTransaction tx = entityManager.getTransaction();
        tx.begin();
        final Inventory inventory = new Inventory();
        final Stock stock1 = createStockWithProducts(entityManagerFactory, 10L, "Coca Cola");
        final Stock stock2 = createStockWithProducts(entityManagerFactory, 20L, "Pepsi Cola");
        inventory.addStock(stock1);
        inventory.addStock(stock2);
        // inventories.persist(inventory);
        tx.commit();
        entityManager.close();
        return inventory;
    }

    private static Stock createStockWithProducts(EntityManagerFactory entityManagerFactory, Long cantidad, String productName) {
        final EntityManager entityManager = entityManagerFactory.createEntityManager();
        final Stocks stocks = new Stocks(entityManager);
        EntityTransaction tx = entityManager.getTransaction();
        tx.begin();
        final Product product = createProduct(entityManagerFactory, productName);
        final Stock stock = Stock.create(cantidad).setProduct(product).build();
        tx.commit();
        entityManager.close();
        System.out.println(stock.getCantidadVencimiento());
        return stock;
    }

    private static Product createProduct(EntityManagerFactory entityManagerFactory, String productName) {
        final EntityManager entityManager = entityManagerFactory.createEntityManager();
        final Products products = new Products(entityManager);
        EntityTransaction tx = entityManager.getTransaction();
        tx.begin();
        final Product product = Product.create(productName).build();
        // products.persist(product);
        tx.commit();
        entityManager.close();
        return product;
    }

    private static String capitalized(String name) {
        return Strings.isNullOrEmpty(name) ? name : name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
    }

     */


}
