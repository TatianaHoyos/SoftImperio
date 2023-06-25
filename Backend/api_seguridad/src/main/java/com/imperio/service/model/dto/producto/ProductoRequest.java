package com.imperio.service.model.dto.producto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProductoRequest {

   private int idCategoria;
   private int idProveedores;
   private String nombreProducto ;
   private String referenciaProducto;
   private float precioProducto;

}

