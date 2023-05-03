package com.imperio.service.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@Entity
@Table(name="permisos")
public class PermisosEntity {
    @Id
    @Column(name = "IdPermiso")
    private Integer idPermiso;

    @Column(nullable = false, name = "NombrePermiso")
    private String nombrePermiso;

   // @ManyToMany(mappedBy = "permisos", fetch = FetchType.LAZY)
   // private Set<RolEntity> roles;
}
