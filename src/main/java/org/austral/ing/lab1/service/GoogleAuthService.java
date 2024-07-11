package org.austral.ing.lab1.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.austral.ing.lab1.model.user.User;
import org.austral.ing.lab1.repository.users.Users;

public class GoogleAuthService {

    private static final String CLIENT_SECRET = "187770462616-vgo5af3u14pb8mdu95ltfrlh0f26p10g.apps.googleusercontent.com";
    private final JWTVerifier verifier;
    private final Users usersRepository;

    public GoogleAuthService(Users usersRepository) {
        Algorithm algorithm = Algorithm.HMAC256(CLIENT_SECRET);
        verifier = JWT.require(algorithm)
                .withIssuer("https://accounts.google.com")
                .build(); //Reusable verifier instance
        this.usersRepository = usersRepository;
    }

    public User authenticate(String idTokenString) {
        try {
            DecodedJWT jwt = verifier.verify(idTokenString);
            String userId = jwt.getSubject(); // This will return the user's Google ID
            return usersRepository.findById(Long.parseLong(userId)).orElse(null);
        } catch (JWTVerificationException exception){
            //Invalid signature/claims
            return null;
        }
    }
}