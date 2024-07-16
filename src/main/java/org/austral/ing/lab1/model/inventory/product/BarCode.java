package org.austral.ing.lab1.model.inventory.product;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@Table(name = "BARCODE")
public class BarCode {
    // Expose annotations are made to include the field in the JSON output and reject the ones that are not exposed
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private Long barCodeId;

    @OneToOne
    @JoinColumn(name = "PRODUCTO_ID", referencedColumnName = "PRODUCTO_ID")
    private Product product;

    @Column(name = "BARCODE")
    private String barCode;

    public BarCode() { }

    public BarCode(Product product, String barCode) {
        this.product = product;
        this.barCode = barCode;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getBarCode() {
        return barCode;
    }

    public void setBarCode(String barCode) {
        this.barCode = barCode;
    }

    public Long getBarCodeId() {
        return barCodeId;
    }
}