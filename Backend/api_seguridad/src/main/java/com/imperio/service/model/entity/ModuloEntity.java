package com.imperio.service.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name="modulo")
public class ModuloEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdModulo")
    private Integer idModulo;

    @Column(nullable = false, name = "Nombre")
    private String nombre;

}
