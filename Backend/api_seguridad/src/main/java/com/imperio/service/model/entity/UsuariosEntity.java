package com.imperio.service.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name="usuarios")
public class UsuariosEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdUsuarios")
    private Integer idUsuarios ;

    @Column(nullable = false, name = "Nombre")
    private String nombre  ;


    @Column(nullable = false, unique = true, name = "Documento")
    private String documento;

    @Column(nullable = false, unique = true, name = "Email")
    private String email;

    @Column(nullable = false, name="Telefono")
    private String telefono;

    @Column(nullable = false, name="Foto")
    private String foto;

    @Column(nullable = false, name="Password")
    private String password;

    @Column(nullable = false, name="Estado")
    private String estado;

    @ManyToOne()
    @JoinColumn(name = "IdRol", nullable = false)
    private RolEntity rol;

}
