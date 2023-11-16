package com.imperio.service.oauth2.jwt;

import com.imperio.service.model.entity.UsuariosEntity;

public interface IJwtService {
    String extraerDatosUsuarios(String token);
    String  generarToken(UsuariosEntity user);
    boolean isTokenValido(String token, UsuariosEntity user);

}
