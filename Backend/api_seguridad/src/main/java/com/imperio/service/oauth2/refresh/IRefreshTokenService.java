package com.imperio.service.oauth2.refresh;

import com.imperio.service.model.entity.OAuthEntity;
import com.imperio.service.model.entity.UsuariosEntity;

import java.util.Optional;

public interface IRefreshTokenService {
    OAuthEntity crearRefreshToken(int idUser );

    OAuthEntity crearRefreshToken(UsuariosEntity usuarios);

    Optional<OAuthEntity> encontrarToken(String token);

    OAuthEntity verificarVigenciaToken(OAuthEntity oAuth);
    int eliminarToken(int idUser);

}
