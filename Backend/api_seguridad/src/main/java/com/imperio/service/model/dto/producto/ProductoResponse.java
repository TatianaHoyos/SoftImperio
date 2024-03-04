package com.imperio.service.model.dto.producto;

import com.imperio.service.model.dto.existencias.ExistenciaDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoResponse {
    private Integer idProductos;
    private Integer idCategoria;
    private String nombreProducto;
    private String fotoProducto;
    private float precioProducto;
    private String referenciaProducto;
    private String nombreCategoria;
    private ExistenciaDto existencia;

}
