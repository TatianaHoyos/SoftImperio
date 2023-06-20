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

    @Column(nullable = false, name = "NombrePermisos")
    private String nombrePermiso;
    @Column(nullable = false, name = "Modulo")
    private String modulo;

    // @ManyToMany(mappedBy = "permisos", fetch = FetchType.LAZY)
    // private Set<RolEntity> roles;
}