package org.austral.ing.lab1.object.jsonparsable;

import java.time.LocalDateTime;

public class Token {
    private final String token;
    private LocalDateTime expirationDate;

    public Token(String token, LocalDateTime expirationDate) {
        this.token = token;
        this.expirationDate = expirationDate;
    }

    public String getToken() {
        return token;
    }

    public LocalDateTime getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDateTime expirationDate) {
        this.expirationDate = expirationDate;
    }
}
