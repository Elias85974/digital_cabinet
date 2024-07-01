package org.austral.ing.lab1.controller;

public class TokenController {
    public TokenController() {
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
    }
}
