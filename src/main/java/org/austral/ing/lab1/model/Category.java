package org.austral.ing.lab1.model;

import com.google.gson.Gson;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
public class Category {
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private Long categoria_ID;

    @Column(name = "NAME")
    private String nombre;

    @Column(name = "QUANTITY_TOTAL")
    private Integer cantTotal;

    public Category() { }

    public Category(CategoryBuilder builder) {
        this.nombre = builder.nombre;
        this.cantTotal = builder.cantTotal;
    }

    public Long getCategoria_ID() {
        return categoria_ID;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getCantTotal() {
        return cantTotal;
    }

    public void setCantTotal(Integer cantTotal) {
        this.cantTotal = cantTotal;
    }

    public static CategoryBuilder create(String nombre){
        return new CategoryBuilder(nombre);
    }

    public static class CategoryBuilder{
        private final String nombre;
        private Integer cantTotal;

        public CategoryBuilder(String nombre) {
            this.nombre = nombre;
        }

        public CategoryBuilder withCantTotal(Integer cantTotal) {
            this.cantTotal = cantTotal;
            return this;
        }

        public Category build(){
            return new Category(this);
        }
    }

    public static Category fromJson(String json) {
        final Gson gson = new Gson();
        return gson.fromJson(json, Category.class);
    }

    public String asJson() {
        Gson gson = new Gson();
        return gson.toJson(this);
    }

}
