package org.austral.ing.lab1.model;

import com.google.gson.Gson;
import com.google.gson.annotations.Expose;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.List;

@Entity
public class Category {
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    @Expose
    private Long categoria_ID;

    @Column(name = "NAME")
    @Expose
    private String nombre;

    // Not exposed, so it won't be included in the JSON output
    @OneToMany(mappedBy = "category")
    private List<Product> products;

    public Category() { }

    public Category(CategoryBuilder builder) {
        this.nombre = builder.nombre;
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

    public static CategoryBuilder create(String nombre){
        return new CategoryBuilder(nombre);
    }

    public static class CategoryBuilder{
        private final String nombre;

        public CategoryBuilder(String nombre) {
            this.nombre = nombre;
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
