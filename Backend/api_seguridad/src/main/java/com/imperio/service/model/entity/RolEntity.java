package com.imperio.service.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@Entity
@Table(name="rol")
public class RolEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdRol")
    private Integer idRol  ;

    @Column(nullable = false, name = "NombreRol")
    private String nombreRol;

    @Column(nullable = false, name = "Estado")
    private String estado;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "configuracion",
    joinColumns = {
            @JoinColumn(name = "IdRol", referencedColumnName = "IdRol")
    },
    inverseJoinColumns = {
            @JoinColumn(name = "IdPermisos", referencedColumnName = "IdPermisos")
    })
    private Set<PermisosEntity> permisos;


    public String toString() {
        return "" +
                "idRol=" + idRol + '\n' +
                "nombreRol=" + nombreRol ;

    }

}
