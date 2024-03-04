package com.imperio.service.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
@Entity
@Table(name="categoria")
public class CategoriaEntity {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "IdCategoria")
        private Integer idCategoria ;

        @Column(nullable = false, name = "NombreCategoria")
        private String nombreCategoria;
}
