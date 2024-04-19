package org.austral.ing.lab1.model;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
public class Category {
    @Id
    @GeneratedValue(generator = "increment")
    @GenericGenerator(name = "increment", strategy = "increment")
    private Long ID_categoria;

    @Column(name = "NAME")
    private String nombre;

    @Column(name = "QUANTITY_TOTAL")
    private Integer cantTotal;

}
