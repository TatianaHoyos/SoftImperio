package com.imperio.service.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name="producto")
public class ProductoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idProducto")
    private Integer idProducto;

    @Column(name = "idCategoria")
    private Integer idCategoria;

  @Column(name = "nombreProducto")
    private String nombreProducto;

   @Column(name = "referenciaProducto")
    private String referenciaProducto;

    @Column(name = "fotoProducto")
    private String fotoProducto;

    @Column(name="precioProducto")
    private float precioProducto;


    public String toString() {
        return "" +
                "idProducto=" + idProducto + '\n' +
                "idCategoria=" + idCategoria + '\n' +
                "nombreProducto=" + nombreProducto + '\n' +
                "referenciaProducto=" + referenciaProducto + '\n' +
                "fotoProducto=" + fotoProducto + '\n' +
                "precioProducto " + precioProducto +'\n';
    }

}
