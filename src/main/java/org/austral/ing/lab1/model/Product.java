package org.austral.ing.lab1.model;

import com.google.gson.Gson;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@Table(name = "PRODUCT")
public class Product {
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private Long product_ID;

    @Column(name = "NAME")
    private String nombre;

    @Column(name = "BRAND")
    private String marca;

    @Column(name = "CUANTITY_TYPE")
    private String tipoDeCantidad;

    @Column(name = "CATEGORY_ID")
    private Long categoria_ID;


    public Product() { }

    public Product(String nombre, String marca, String tipoDeCantidad, Long categoria_ID) {
        this.nombre = nombre;
        this.marca = marca;
        this.tipoDeCantidad = tipoDeCantidad;
        this.categoria_ID = categoria_ID;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getTipoDeCantidad() {
        return tipoDeCantidad;
    }

    public void setTipoDeCantidad(String tipoDeCantidad) {
        this.tipoDeCantidad = tipoDeCantidad;
    }

    public Long getCategoria_ID() {
        return categoria_ID;
    }

    public void setCategoria_ID(Long categoria_ID) {
        this.categoria_ID = categoria_ID;
    }

    public Long getProduct_ID() {
        return product_ID;
    }

    public static ProductBuilder create(String nombre) {
        return new ProductBuilder(nombre);
    }

    public static class ProductBuilder {
        private final String nombre;
        private String marca;
        private String tipoDeCantidad;
        private Long categoria_ID;


        public ProductBuilder(String nombre) {
            this.nombre = nombre;
        }

        public ProductBuilder withMarca(String marca) {
            this.marca = marca;
            return this;
        }

        public ProductBuilder withTipoDeCantidad(String tipoDeCantidad) {
            this.tipoDeCantidad = tipoDeCantidad;
            return this;
        }

        public ProductBuilder withCategoria_ID(Long categoria_ID) {
            this.categoria_ID = categoria_ID;
            return this;
        }

        public Product build() {
            return new Product(this);
        }

    }

    public static Product fromJson(String json) {
        final Gson gson = new Gson();
        return gson.fromJson(json, Product.class);
    }

    public String asJson() {
        Gson gson = new Gson();
        return gson.toJson(this);
    }

    private Product(ProductBuilder builder) {
        this.nombre = builder.nombre;
        this.marca = builder.marca;
        this.tipoDeCantidad = builder.tipoDeCantidad;
        this.categoria_ID = builder.categoria_ID;
    }
}
