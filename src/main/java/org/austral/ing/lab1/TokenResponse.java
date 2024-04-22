package org.austral.ing.lab1;

import java.util.Base64;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;


public class TokenResponse {
    private static final Key JWT_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static final Set<String> expiredTokens = new HashSet<>();

    public static String generateToken(String email) {
        return Jwts.builder().setSubject(email).claim("email", email).setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + 1000 * 60))
                .signWith(JWT_KEY).compact();
    }

    public static String getUserEmail(String token){
        try { System.out.println("Secret key: " + Base64.getEncoder().encodeToString(JWT_KEY.getEncoded()));
            System.out.println("Token: " + token);
            return Jwts.parserBuilder().setSigningKey(JWT_KEY).build().parseClaimsJws(token).getBody().get("email", String.class);
        } catch (Exception e) {
            System.out.println("Error al decodificar el token: " + e.getMessage());
            return null;
        }
    }

    public static void invalidateToken(String token){
        expiredTokens.add(token);
    }

    public static boolean isTokenValid(String token){
        return !expiredTokens.contains(token);
    }

    public static boolean isAuthorized(String token, String requestedEmail) {

        // Verificar si el token es válido
        if (!isTokenExpired(token)) {

            // Obtener el correo electrónico asociado al token
            String userEmail = getUserEmail(token);

            // Verificar si el correo electrónico obtenido está vacío o nulo
            if (userEmail == null || userEmail.isEmpty()) {
                return false;
            }
            // Verificar si el correo electrónico del token coincide con el correo solicitado
            return userEmail.equals(requestedEmail);
        }
        return false;
    }

    public static boolean isTokenExpired(String token){
        try {
            Claims claims = Jwts.parserBuilder().setSigningKey(JWT_KEY).build().parseClaimsJws(token).getBody();
            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            System.out.println("Error checking token expiration: " + e.getMessage());
            return true; // Consider the token as expired if an error occurs
        }
    }
}
