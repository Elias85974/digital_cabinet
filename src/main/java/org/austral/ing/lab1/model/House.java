
package org.austral.ing.lab1.model;

import com.google.gson.Gson;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@Table(name = "HOUSE")
public class House {
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private Long Casa_ID;

    @Column
    private String nombre;

    @Column
    private String direccion;

    public House() { }

    public static HouseBuilder create(Inventory inventario) {
        return new HouseBuilder();
    }

    public void setCasa_ID(Long id) {
        this.Casa_ID = id;
    }

    public Long getCasa_ID() {
        return Casa_ID;
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
        this.nombre = builder.nombre;
        this.direccion = builder.direccion;
    }

    public static House fromJson(String json) {
        return new Gson().fromJson(json, House.class);
    }

    public String asJson() {
        return new Gson().toJson(this);
    }

    public static class HouseBuilder {
        private String nombre;
        private String direccion;

        public HouseBuilder() {}

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
