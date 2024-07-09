package org.austral.ing.lab1;

import org.austral.ing.lab1.object.Token;
import spark.Spark;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class TokenValidator {
    private static final Map<Long, Token> tokens = new HashMap<>();
    private static final Integer TOKEN_EXPIRATION_MINUTES = 1;
    private static final SecureRandom secureRandom = new SecureRandom();
    private static final Base64.Encoder base64Encoder = Base64.getUrlEncoder();

    public static String addNewToken(Long userId) {
        String token = generateNewToken();
        while (hasToken(token)) {
            token = generateNewToken();
        }
        tokens.put(userId, new Token(token, LocalDateTime.now().plusMinutes(TOKEN_EXPIRATION_MINUTES)));
        return token;
    }

    public static void removeToken(Long userId) {
        tokens.remove(userId);
    }

    public static boolean hasToken(String token) {
        return tokens.values().stream().anyMatch(t -> t.getToken().equals(token));
    }

    // Middleware for authentication, breaks the request if the token is invalid
    public static void authenticateRequest(spark.Request req, spark.Response res) {
        Long userId = Long.parseLong(req.headers("UserId"));
        String token = req.headers("Token");

        boolean isValid = validateToken(userId, token);

        if (!isValid) {
            Spark.halt(401, "Unauthorized");
        }
    }

    // Method to validate token
    public static boolean validateToken(Long userId, String token) {
        Token storedToken = tokens.get(userId);

        if (storedToken == null) {
            return false;
        }

        if (storedToken.getExpirationDate().isBefore(LocalDateTime.now())) {
            tokens.remove(userId);
            return false;
        }

        if (storedToken.getToken().equals(token)) {
            storedToken.setExpirationDate(LocalDateTime.now().plusMinutes(TOKEN_EXPIRATION_MINUTES));
            return true;
        }

        return false;
    }

    private static String generateNewToken() {
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }
}
