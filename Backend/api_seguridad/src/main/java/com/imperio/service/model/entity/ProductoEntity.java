package com.imperio.service.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name="productos")
public class ProductoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdProductos")
    private Integer idProductos ;

    //@Column(nullable = false, name = "IdCategoria")
    //private Integer idCategoria ;

    @Column(nullable = false, name = "NombreProducto")
    private String nombreProducto;

    @Column(nullable = false, name="FotoProducto")
    private String fotoProducto;

    @Column(nullable = false, name="PrecioProducto")
    private float precioProducto;

    @Column(nullable = false, name="ReferenciaProducto")
    private String referenciaProducto;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "IdCategoria")
    private CategoriaEntity categoria;

}
