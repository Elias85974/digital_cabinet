package org.austral.ing.lab1.model;

import com.google.gson.Gson;
import org.austral.ing.lab1.TokenResponse;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "USER")
public class User {
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private Long usuario_ID;

    @OneToMany(mappedBy = "usuario", fetch = FetchType.EAGER)
    private List<LivesIn> livesIns;

    @Column(name = "FIRST_NAME", nullable = false)
    private String nombre;

    @Column(name = "LAST_NAME", nullable = false)
    private String apellido;

    @Column(name = "AGE")
    private int age;

    @Column(name = "EMAIL", nullable = false, unique = true)
    private String mail;

    @Column(name = "PASSWORD", nullable = false)
    private String password;

    @Column(name = "PHONE")
    private String phone;

    @Column(name = "TOKEN")
    private String token;

    public User() { }

    public static UserBuilder create(String email) {
        return new UserBuilder(email);
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String email) {
        this.mail = email;
    }

    public Long getUsuario_ID() {
        return usuario_ID;
    }

    public void setUsuario_ID(Long id) {
        this.usuario_ID = id;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public List<LivesIn> getLivesIns() {
        return livesIns;
    }


    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    private User(UserBuilder builder) {
        this.nombre = builder.firstName;
        this.apellido = builder.lastName;
        this.password = builder.password;
        this.mail = builder.email;
    }

    public static User fromJson(String json) {
        final Gson gson = new Gson();
        return gson.fromJson(json, User.class);
    }

    public String asJson() {
        Gson gson = new Gson();
        return gson.toJson(this);
    }


    // Asume que tienes un método getHouses() en tu clase User que devuelve todas las casas a las que el usuario tiene acceso
    public String getHousesAsJson() {
        List<House> houses = livesIns.stream()
                .map(LivesIn::getCasa)
                .collect(Collectors.toList());
        return new Gson().toJson(houses);
    }

    public static class UserBuilder {
        private final String email;
        private String firstName;
        private String lastName;
        private String password;
        @Transient // This annotation is used because TokenResponse is not a basic type or an Entity
        private TokenResponse tokenResponse;
        public TokenResponse getTokenResponse() {
            return tokenResponse;
        }
        public void setTokenResponse(TokenResponse tokenResponse) {
            this.tokenResponse = tokenResponse;
        }
        public UserBuilder(String email) {
            this.email = email;
        }

        public UserBuilder setPassword(String password) {
            this.password = password;
            return this;
        }

        public UserBuilder setFirstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public UserBuilder setLastName(String lastName) {
            this.lastName = lastName;
            return this;
        }


        public User build() {
            return new User(this);
        }

    }

}
