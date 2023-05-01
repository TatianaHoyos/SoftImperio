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
    @Column(name = "idCategoria")
    private Integer idCategoria;

    @Column(name = "nombreCategoria")
    private String nombreCategoria;


    public String toString() {
        return "" +
                "idCategoria=" + idCategoria + '\n' +
                "nombreCategoria=" + nombreCategoria + '\n';


    }

}
