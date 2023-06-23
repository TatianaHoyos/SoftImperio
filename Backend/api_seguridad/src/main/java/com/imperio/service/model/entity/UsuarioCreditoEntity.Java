package com.imperio.service.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name="usuarioCreditos")
public class UsuarioCreditoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IdUsuarioCredito")
    private Integer idUsuarioCredito ;

    @Column(nullable = false, name = "Nombre")
    private String nombre;

    @Column(nullable = false, name="Documento")
    private String documento;

    @Column(nullable = false, name="Telefono")
    private String telefono;

}
