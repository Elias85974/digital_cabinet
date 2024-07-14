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
}