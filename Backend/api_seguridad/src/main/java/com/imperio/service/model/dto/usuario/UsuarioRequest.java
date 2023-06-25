package com.imperio.service.model.dto.usuario;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UsuarioRequest {
    private String nombre;
    private String documento;
    private String email;
    private int idRol;
    private String estado;
    private String telefono;
}
