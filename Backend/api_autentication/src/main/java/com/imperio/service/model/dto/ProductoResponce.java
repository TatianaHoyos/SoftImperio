package com.imperio.service.model.dto;

import jakarta.persistence.Column;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProductoResponce {
    private Integer id;
    private String nombre;
    private Integer idCategoria;
    private String referencia;
    private String foto;
    private float precio;


}
