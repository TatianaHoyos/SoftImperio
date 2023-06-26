package com.imperio.service.model.dto.proveedor;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProveedorRequest {

    private int idProveedores;
    private String Nombre;
    private String Documento;
    private String Email;
    private String Direccion;
    private String Telefono;

}