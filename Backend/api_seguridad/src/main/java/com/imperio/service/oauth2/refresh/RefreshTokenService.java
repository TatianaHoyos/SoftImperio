package com.imperio.service.oauth2.refresh;

import com.imperio.service.model.entity.OAuthEntity;
import com.imperio.service.model.entity.UsuariosEntity;
import com.imperio.service.repository.OAuthService;
import com.imperio.service.repository.UsuariosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService implements IRefreshTokenService {
    @Value("${jwt.refresh.expiration.ms}")
    private int refreshTokenDuration;

    @Autowired
    private UsuariosService usuariosService;

    @Autowired
    private OAuthService oAuthService;

    @Override
    public OAuthEntity crearRefreshToken(int idUser) {
        OAuthEntity oAuth = new OAuthEntity();
        oAuth.setUsuariosEntity(usuariosService.obtenerUsuarioId(idUser).get());
        oAuth.setExpiryDate(Instant.now().plusMillis(refreshTokenDuration));
        oAuth.setToken(UUID.randomUUID().toString());


        return oAuthService.guardarToken(oAuth);
    }

    @Override
    public OAuthEntity crearRefreshToken(UsuariosEntity usuarios) {
        OAuthEntity oAuth = new OAuthEntity();
        oAuth.setUsuariosEntity(usuarios);
        oAuth.setExpiryDate(Instant.now().plusMillis(refreshTokenDuration));
        oAuth.setToken(UUID.randomUUID().toString());


        return oAuthService.guardarToken(oAuth);
    }

    @Override
    public Optional<OAuthEntity> encontrarToken(String token) {
        return oAuthService.encontrarToken(token);
    }

    @Override
    public OAuthEntity verificarVigenciaToken(OAuthEntity oAuth) {
        if(oAuth.getExpiryDate().compareTo(Instant.now()) < 0){
            oAuthService.eliminarToken(oAuth);
            throw new RuntimeException(oAuth.getToken() + " El token a EXpirado :(");
        }
        return oAuth;
    }

    @Override
    public int eliminarToken(int idUser) {
        var usuario = usuariosService.obtenerUsuarioId(idUser);
        if (usuario.isPresent()) {
            return oAuthService.eliminarTokenUsuario(usuario.get());
        }
        throw new RuntimeException("Token no valido");
    }
}
