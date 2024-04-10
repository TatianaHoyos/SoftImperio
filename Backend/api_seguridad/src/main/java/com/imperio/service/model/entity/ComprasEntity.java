package com.imperio.service.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.joda.time.DateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name="compra")
public class ComprasEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdCompra")
    private Integer idCompra ;

    @Column(nullable = false, name = "FechaCompra")
    private String fechaCompra;

    @Column(nullable = false, name = "TotalCompra")
    private double totalCompra;
}
