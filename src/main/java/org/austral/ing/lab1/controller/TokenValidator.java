package org.austral.ing.lab1.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.austral.ing.lab1.repository.users.Users;
import spark.Response;
import spark.Spark;

import javax.persistence.EntityManagerFactory;
import java.time.Instant;
import java.util.Date;

public class TokenValidator {
    private static final String SECRET = "r7kgiQUw0bdMBSpmTBXjG0GOUfZ-uM-d"; // Use a strong secret key
    private static final Algorithm algorithm = Algorithm.HMAC256(SECRET);
    private static final long TOKEN_EXPIRATION_TIME = 1800L; // 30 minutes
    private static final long RENEWAL_THRESHOLD = 300L; // Renew token if it expires within 5 minutes
    private static EntityManagerFactory entityManagerFactory;

    public static void setEntityManagerFactory(EntityManagerFactory entityManagerFactory) {
        TokenValidator.entityManagerFactory = entityManagerFactory;
    }

    // Generate a new JWT token
    public static String generateToken(Long userId) {
        return JWT.create()
                .withClaim("userId", userId)
                .withExpiresAt(Date.from(Instant.now().plusSeconds(TOKEN_EXPIRATION_TIME)))
                .sign(algorithm);
    }

    // Middleware for authentication, breaks the request if the token is invalid
    public static void authenticateRequest(spark.Request req, Response res) {
        String token = req.headers("Token");
        try {
            JWTVerifier verifier = JWT.require(algorithm).build();
            DecodedJWT jwt = verifier.verify(token);

            // Check if token is close to expiry and renew it
            long timeDifference = jwt.getExpiresAt().getTime() - System.currentTimeMillis();
            if (timeDifference <= RENEWAL_THRESHOLD * 1000) {
                // Token is close to expiry, generate a new one
                Long userId = jwt.getClaim("userId").asLong();
                Users usersRepo = new Users(entityManagerFactory.createEntityManager());
                token = generateToken(userId);
                usersRepo.setUserToken(userId, token);
            }
            res.header("Token", token);
        } catch (JWTVerificationException exception) {
            // Token is invalid
            Spark.halt(401, "Unauthorized");
        }
    }
}
