package com.imperio.service.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name="proveedores")
public class ProveedoresEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdProveedores")
    private Integer idProveedores ;

    @Column(nullable = false, name = "Nombre")
    private String Nombre ;

    @Column(nullable = false, name = "Documento")
    private String Documento  ;

    @Column(nullable = false, name = "Email")
    private String Email  ;

    @Column(nullable = false, name = "Direccion")
    private String Direccion  ;

    @Column(nullable = false, name = "Telefono")
    private String Telefono  ;

}