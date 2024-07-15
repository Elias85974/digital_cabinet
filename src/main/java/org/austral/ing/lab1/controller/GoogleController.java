package org.austral.ing.lab1.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.gson.JsonObject;
import org.austral.ing.lab1.model.user.User;
import org.austral.ing.lab1.repository.users.Users;
import spark.Spark;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.Optional;

public class GoogleController {
    private final GoogleIdTokenVerifier verifier;
    private final EntityManagerFactory entityManagerFactory;

    public GoogleController(EntityManagerFactory entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
        NetHttpTransport transport = new NetHttpTransport();
        JsonFactory jsonFactory = new GsonFactory();
        verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                .setAudience(List.of("213797815882-10kd2qmj4hmmla4oa3s4kphqp8c4btvj.apps.googleusercontent.com"))
                .build();
    }

    public void init() {
        Spark.post("/google-login", (req, res) -> {
            try {
                String token = req.headers("Authorization").substring(7);
                GoogleIdToken idToken = verifier.verify(token);
                if (idToken == null) {
                    throw new GeneralSecurityException("Invalid token");
                }
                GoogleIdToken.Payload payload = idToken.getPayload();
                List<String> attributes = handleGoogleUser(payload.getEmail(), (String) payload.get("given_name"), (String) payload.get("family_name"));
                String[] attributeNames = {"email", "userId", "token"};
                JsonObject jsonResponse = new JsonObject();
                for (int i = 0; i < attributes.size(); i++) {
                    jsonResponse.addProperty(attributeNames[i], attributes.get(i));
                }
                return jsonResponse;
            } catch (Exception e) {
                res.status(500);
                return "An error occurred while verifying the token";
            }
        });
    }

    private List<String> handleGoogleUser(String email, String name, String surname) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Users usersRepo = new Users(entityManager);
        entityManager.getTransaction().begin();
        Optional<User> optionalUser = usersRepo.findByEmail(email);
        User user = optionalUser.orElseGet(() -> usersRepo.createGoogleUser(email, name, surname));
        Long userId = user.getUsuario_ID();
        String token = TokenValidator.generateToken(userId);
        user.setToken(token);
        entityManager.getTransaction().commit();
        return List.of(email, userId.toString(), token);
    }
}