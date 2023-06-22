package com.imperio.service.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name="configuracion")
public class ConfiguracionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdConfiguracion")
    private Integer idConfiguracion  ;

    @Column(nullable = false, name = "IdPermisos")
    private Integer idPermisos;

    @Column(nullable = false, name = "idRol")
    private Integer idRol  ;

    @Column(nullable = false, name = "Estado")
    private String estado  ;
}
