package org.austral.ing.lab1;
public class TokenResponse {
    private String token;
    private String refreshToken;

    public TokenResponse(String token, String refreshToken) {
        this.token = token;
        this.refreshToken = refreshToken;
    }

    public String getToken() {
        return token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }
}
