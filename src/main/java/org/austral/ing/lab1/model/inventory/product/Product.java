package org.austral.ing.lab1.model.inventory.product;

import com.google.gson.*;
import com.google.gson.annotations.Expose;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.lang.reflect.Type;

@Entity
@Table(name = "PRODUCT")
public class Product {
    // Expose annotations are made to include the field in the JSON output and reject the ones that are not exposed
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    @Expose
    private Long producto_ID;

    @Column(name = "NAME")
    @Expose
    private String nombre;

    @Column(name = "BRAND")
    @Expose
    private String marca;

    @Column(name = "QUANTITY_TYPE")
    @Expose
    private String tipoDeCantidad;

    @ManyToOne
    @JoinColumn(name = "CATEGORY_ID", referencedColumnName = "CATEGORIA_ID")
    @Expose
    private Category category;

    @Column(name = "IS_VERIFIED")
    private boolean isVerified;

    public Product() { }

    public Product(String nombre, String marca, String tipoDeCantidad, Long categoria_ID) {
        this.nombre = nombre;
        this.marca = marca;
        this.tipoDeCantidad = tipoDeCantidad;
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

    public void setCategory(Category category) {
        if (this.category != category) {
            this.category = category;
            category.addProduct(this);
        }
    }

    public Category getCategory() {
        return category;
    }

    public Long getCategoria_ID() {
        return category != null ? category.getCategoria_ID() : null;
    }

    public Long getProducto_ID() {
        return producto_ID;
    }

    public static ProductBuilder create(String nombre) {
        return new ProductBuilder(nombre);
    }

    public static class ProductBuilder {
        private final String nombre;
        private String marca;
        private String tipoDeCantidad;

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

        public Product build() {
            return new Product(this);
        }

    }

    public static Product fromJson(String json) {
        final Gson gson = new Gson();
        return gson.fromJson(json, Product.class);
    }

    public String asJson() {
        Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
        return gson.toJson(this);
    }

    private Product(ProductBuilder builder) {
        this.nombre = builder.nombre;
        this.marca = builder.marca;
        this.tipoDeCantidad = builder.tipoDeCantidad;
    }

    public static class ProductSerializer implements JsonSerializer<Product> {

        @Override
        public JsonElement serialize(Product product, Type type, JsonSerializationContext jsonSerializationContext) {
            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("producto_ID", product.getProducto_ID());
            jsonObject.addProperty("nombre", product.getNombre());
            jsonObject.addProperty("marca", product.getMarca());
            jsonObject.addProperty("tipoDeCantidad", product.getTipoDeCantidad());
            jsonObject.addProperty("categoria_ID", product.getCategoria_ID());
            jsonObject.addProperty("categoria", product.getCategory().getNombre());
            return jsonObject;
        }
    }
}
