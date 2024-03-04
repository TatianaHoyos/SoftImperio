package com.imperio.service.services.pdf.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoReporte {

    private String categoria;
    private String nombre;
    private String referencia;
    private int stock;
    private int cantidad;
    private String precio;
}
