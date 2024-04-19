package org.austral.ing.lab1.model;

import com.google.gson.Gson;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@Table(name = "USER")
public class User {

    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private Long Usuario_ID;

    @Column(name = "FIRST_NAME")
    private String nombre;

    @Column(name = "LAST_NAME")
    private String apellido;

    @Column(name = "EMAIL", nullable = false, unique = true)
    private String mail;

    @Column(name = "PASSWORD")
    private String password;

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
        return Usuario_ID;
    }

    public void setUsuario_ID(Long id) {
        this.Usuario_ID = id;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
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

    public static class UserBuilder {
        private final String email;
        private String firstName;
        private String lastName;
        private String password;

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
