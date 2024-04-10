package com.imperio.service.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name="venta")
public class VentaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdVenta")
    private Integer idVenta ;

    @Column(nullable = false, name = "FechaVenta")
    private String fechaVenta;

    @Column(nullable = false, name = "TotalVenta")
    private double totalVenta;

    @Column(nullable = false, name = "Estado")
    private String estado;

    @Column(nullable = false, name = "Origen")
    private String Origen;
}
