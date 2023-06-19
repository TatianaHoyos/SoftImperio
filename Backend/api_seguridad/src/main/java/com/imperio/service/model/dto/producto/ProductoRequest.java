package com.imperio.service.model.dto.producto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProductoRequest {
   private int idProductos;
   private int IdCategoria;
   private int IdProveedores;
   private int Cantidad;
   private String NombreProducto ;
   private String ReferenciaProducto;
   private float PrecioProducto;

}
