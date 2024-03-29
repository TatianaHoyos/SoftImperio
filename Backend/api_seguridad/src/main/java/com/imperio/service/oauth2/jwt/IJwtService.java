package com.imperio.service.oauth2.jwt;

import com.imperio.service.model.entity.OAuthEntity;
import com.imperio.service.model.entity.UsuariosEntity;

import java.util.Map;
import java.util.Optional;

public interface IJwtService {
    Map<String, Object> extraerDatosUsuarios(String token);
    String  generarToken(UsuariosEntity user);
    boolean isTokenValido(String token, UsuariosEntity user);
    boolean isTokenValido(String token);

    Optional<OAuthEntity> encontrarToken(String token);

    void eliminarToken(OAuthEntity oAuth);

}
