package org.austral.ing.lab1.model;

import com.google.gson.Gson;
import org.austral.ing.lab1.model.livesIn.LivesIn;
//import org.austral.ing.lab1.TokenResponse;
import org.austral.ing.lab1.object.SpecialSet;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "USER")
public class User {
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private Long usuario_ID;

    @OneToMany(mappedBy = "usuario", fetch = FetchType.EAGER)
    private Set<LivesIn> livesIns = new SpecialSet<>();

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

    @OneToOne
    @JoinColumn(name = "WISHLIST_ID")
    private WishList wishList;

    public User() { }

    /*
    public static UserBuilder create(String email) {
        return new UserBuilder(email);
    }

     */

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

    public void setWishList(WishList wishList) {
        this.wishList = wishList;
    }

    public WishList getWishList() {
        return wishList;
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

    public Set<LivesIn> getLivesIns() {
        return livesIns;
    }


    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    /*
    private User(UserBuilder builder) {
        this.nombre = builder.firstName;
        this.apellido = builder.lastName;
        this.password = builder.password;
        this.mail = builder.email;
        this.livesIns = builder.livesIns;
    }

     */

    public static User fromJson(String json) {
        final Gson gson = new Gson();
        return gson.fromJson(json, User.class);
    }

    public String asJson() {
        Gson gson = new Gson();
        return gson.toJson(this);
    }


    public String getHousesAsJson() {
        List<House> houses = getHouses();
        StringBuilder sb = new StringBuilder();
        sb.append("[");
        for (int i = 0; i < houses.size(); i++) {
            House house = houses.get(i);
            sb.append("{");
            sb.append("\"houseId\": ").append(house.getCasa_ID()).append(",");
            sb.append("\"name\": \"").append(house.getNombre()).append("\",");
            sb.append("\"address\": \"").append(house.getDireccion()).append("\"");
            sb.append("}");
            if (i < houses.size() - 1) {
                sb.append(",");
            }
        }
        sb.append("]");
        return sb.toString();
    }

    public List<House> getHouses() {
        List<House> houses = new ArrayList<>();
        for (LivesIn livesIn : livesIns) {
            houses.add(livesIn.getCasa());
        }
        return houses;
    }

    /*
    public static class UserBuilder {
        private final String email;
        private final List<LivesIn> livesIns;
        private String firstName;
        private String lastName;
        private String password;
        //@Transient // This annotation is used because TokenResponse is not a basic type or an Entity
//        private TokenResponse tokenResponse;
//        public TokenResponse getTokenResponse() {
//            return tokenResponse;
//        }
//        public void setTokenResponse(TokenResponse tokenResponse) {
//            this.tokenResponse = tokenResponse;
//        }
        public UserBuilder(String email) {
            this.email = email;
            this.livesIns = new ArrayList<>();
        }


        public User build() {
            return new User(this);
        }

    }

     */

}
