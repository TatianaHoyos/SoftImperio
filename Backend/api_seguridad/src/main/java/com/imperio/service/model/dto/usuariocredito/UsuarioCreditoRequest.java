package com.imperio.service.model.dto.usuariocredito;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UsuarioCreditoRequest {

    private int IdUsuarioCredito;
    private String Nombre;
    private String Documento;
    private String Telefono;


}
