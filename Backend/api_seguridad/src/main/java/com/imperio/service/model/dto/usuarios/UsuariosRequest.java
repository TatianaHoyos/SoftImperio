package com.imperio.service.model.dto.producto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UsuariosRequest {

    private int idUsuarios;
    private int idRol
    private String nombre ;
    private String documento;
    private String email;
    private String telefono;
    private String foto;
    private String Password;
    private String estado;

}
