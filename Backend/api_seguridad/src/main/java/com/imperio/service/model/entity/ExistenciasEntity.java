package com.imperio.service.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name="existencia")
public class ExistenciasEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdExistencias")
    private Integer idExistencias ;

    @Column(nullable = false, name = "Stock")
    private Integer stock;

    @Column(nullable = false, name = "Cantidad")
    private Integer cantidad;

    @Column(nullable = false, name = "Estado")
    private String estado;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "IdProductos")
    private ProductoEntity productos;

}
