package com.imperio.service.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name="usuario")
public class UsuarioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String documento;
    @Column(nullable = false)
    private String nombre;
    @Column(unique=true, nullable=false)
    private String apellido;
    @Column(unique=true, nullable=false)
    private String correo;
    @Column(unique=true, nullable=false)
    private String password;


    public String toString() {
        return "" +
                "nombre=" + nombre + '\n' +
                "apellido=" + apellido + '\n' +
                "correo=" + correo + '\n' +
                "password=  **** " + '\n';
    }

}
