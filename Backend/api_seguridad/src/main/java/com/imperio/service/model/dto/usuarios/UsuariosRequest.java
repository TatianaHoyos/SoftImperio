package com.imperio.service.model.dto.usuarios;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UsuariosRequest {
    private int idRol;
    private String nombre ;
    private String documento;
    private String email;
    private String telefono;
    private String estado;

}
