package com.imperio.service.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name="usuarios")
public class UsuarioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdUsuario")
    private Integer idUsuario ;

    @Column(nullable = false, name = "Nombre")
    private String nombre;

    @Column(nullable = false, name = "Documento")
    private String documento;

    @Column(nullable = false, name="Email")
    private String email;

    @Column(nullable = false, name="Password")
    private String password;

    @Column(nullable = false, name="IdRol")
   // @ManyToOne
   // @JoinColumn(name = "IdRol")
    private Integer idRol ;

    @Column(nullable=false, name = "Estado")
    private String estado;

    @Column(nullable=false, name = "Telefono")
    private String telefono;

    @Column(nullable=false, name = "Foto")
    private String foto;


    public String toString() {
        return "" +
                "nombre=" + nombre + '\n' +
                "documento=" + documento + '\n' +
                "email=" + email + '\n' +
                "password=" +"******" + '\n' +
                "idRol=" +  idRol + '\n' +
                "estado=" + estado + '\n' +
                "telefono=" + telefono + '\n' +
                "foto=" + foto ;
    }

}
