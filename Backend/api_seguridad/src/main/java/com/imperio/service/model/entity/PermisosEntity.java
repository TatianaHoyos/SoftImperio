package com.imperio.service.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name="permisos")
public class PermisosEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdPermisos")
    private Integer idPermisos;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "IdAcciones")
    private AccionesEntity acciones;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "IdModulo")
    private ModuloEntity modulo;

}