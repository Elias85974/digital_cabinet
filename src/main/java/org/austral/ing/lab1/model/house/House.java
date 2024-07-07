package org.austral.ing.lab1.model.house;

import com.google.gson.Gson;
import org.austral.ing.lab1.model.chat.Chat;
import org.austral.ing.lab1.model.inventory.Inventory;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@Table(name = "HOUSE")
public class House {
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private Long casa_ID;

    @OneToOne
    @JoinColumn(name = "INVENTARIO_ID", referencedColumnName = "INVENTARIO_ID")
    private Inventory inventario;

    @Column(name = "NOMBRE", nullable = false)
    private String nombre;

    @Column(name = "DIRECCION", nullable = false, unique = true)
    private String direccion;

    @OneToOne(mappedBy = "house", cascade = CascadeType.ALL)
    private Chat chat;

    public House() { }

    public static HouseBuilder create(Inventory inventario) {
        return new HouseBuilder(inventario);
    }

    public void setCasa_ID(Long id) {
        this.casa_ID = id;
    }

    public Long getCasa_ID() {
        return casa_ID;
    }

    public Long getInventario_ID() {
        return inventario.getInventario_ID();
    }

    public Inventory getInventario() {
        return inventario;
    }

    public void setInventario(Inventory inventario) {
        this.inventario = inventario;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getNombre() {
        return nombre;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getDireccion() {
        return direccion;
    }

    private House(HouseBuilder builder) {
        this.inventario = builder.inventario;
        this.nombre = builder.nombre;
        this.direccion = builder.direccion;
    }

    public static House fromJson(String json) {
        return new Gson().fromJson(json, House.class);
    }

    public String asJson() {
        return inventario.asJson();
    }

    public static class HouseBuilder {
        private final Inventory inventario;
        private String nombre;
        private String direccion;

        public HouseBuilder(Inventory inventario) {
            this.inventario = inventario;
        }

        public HouseBuilder withNombre(String nombre) {
            this.nombre = nombre;
            return this;
        }

        public HouseBuilder withDireccion(String direccion) {
            this.direccion = direccion;
            return this;
        }

        public House build() {
            return new House(this);
        }
    }
}
