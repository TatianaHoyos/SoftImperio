package com.imperio.service.controlador;

import com.imperio.service.model.dto.oauth2.Authoritation;
import com.imperio.service.model.dto.login.LoginRequest;
import com.imperio.service.model.dto.comun.Response;
import com.imperio.service.model.dto.login.LoginResponse;
import com.imperio.service.model.dto.oauth2.TokenRequest;
import com.imperio.service.model.dto.oauth2.TokenRefreshRequest;
import com.imperio.service.model.dto.oauth2.TokenRefreshResponse;
import com.imperio.service.model.entity.OAuthEntity;
import com.imperio.service.oauth2.jwt.JwtService;
import com.imperio.service.oauth2.refresh.RefreshTokenService;
import com.imperio.service.repository.UsuariosService;
import com.imperio.service.services.EncryptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.NoSuchAlgorithmException;

@Slf4j
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class ControllerOAuth2 {

    @Autowired
    private UsuariosService usuariosService;

    @Autowired
    private EncryptService encryptService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private RefreshTokenService refreshTokenService;

    private String urlServer = "http:localhost:8080/";

    @Operation(summary = "Autenticación de usuario", responses = {
            @ApiResponse(description = "Autenticación exitosa", responseCode = "200",
                    content = @Content(mediaType = "application/json",
                    schema = @Schema(implementation = LoginResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication Failure",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Response.class))) })
    @PostMapping(value = "api/login", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest usuarios) {
        System.out.println("usuarios");

        var usuariodb = usuariosService.obtenerUsuarioCorreo(usuarios.getCorreo());
        if (usuariodb != null) {
            try {
                if (encryptService.verifyHash(usuarios.getPassword(), usuariodb.getPassword())) {
                    LoginResponse response = new LoginResponse();
                    response.setDocumento(usuariodb.getDocumento());
                    response.setNombre(usuariodb.getNombre());
                    response.setFoto(urlServer + usuariodb.getFoto());
                    response.setRol(usuariodb.getIdRol());

                    String jwt = jwtService.generarToken(usuariodb);
                    OAuthEntity refreshJwt = refreshTokenService.crearRefreshToken(usuariodb,jwt);

                    response.setAuthoritation(Authoritation.builder()
                                    .accessToken(jwt)
                                    .refreshToken(refreshJwt.getTokenRefresh())
                            .build());

                    return ResponseEntity.ok(response);
                }
                else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(new Response("error", "no esta autorizado"));
                }
            } catch (NoSuchAlgorithmException e) {
                log.error("Login hash", e);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new Response("error", "no esta autorizado"));
            }


        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new Response("error", "no esta autorizado"));
        }
    }

    @Operation(summary = "Refresh del token jwt", responses = {
            @ApiResponse(description = "Refresh del token exitosa", responseCode = "200",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TokenRefreshResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication Failure",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Response.class))) })

    @PostMapping(value = "api/refreshToken", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> refreshToken(@Valid @RequestBody TokenRefreshRequest refresh) {
        String refreshToken = refresh.getRefreshToken();
        try {
            var tokenRefreshResponseJwt = refreshTokenService.encontrarTokenRefresh(refreshToken)
                    .map(refreshTokenService::verificarVigenciaToken)
                    .map(OAuthEntity::getUsuariosEntity)
                    .map(usuarios -> {
                        String tokenJwt = jwtService.generarToken(usuarios);
                        OAuthEntity refreshJwt = refreshTokenService.crearRefreshToken(usuarios,tokenJwt);

                        var tokenRefreshResponse = new TokenRefreshResponse();
                        tokenRefreshResponse.setAccessToken(tokenJwt);
                        tokenRefreshResponse.setRefreshToken(refreshJwt.getTokenRefresh());
                        return tokenRefreshResponse;
            });


            if (tokenRefreshResponseJwt.isPresent() &&
                    tokenRefreshResponseJwt.get().getAccessToken()!= null &&
                    tokenRefreshResponseJwt.get().getRefreshToken() != null ) {
                return ResponseEntity.ok(tokenRefreshResponseJwt.get());
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new Response("error", "no fue posible refrescar el token"));
            }
        } catch (Exception ex) {
            log.error("Refresh Token", ex);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new Response("error", "no fue posible refrescar el token"));
        }

    }

    @Operation(summary = "Introspect del token jwt", responses = {
            @ApiResponse(description = "introspect del token exitosa", responseCode = "200",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TokenRefreshResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication Failure",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Response.class))) })

    @PostMapping(value = "api/introspectToken", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> introspectToken(@Valid @RequestBody TokenRequest accessToken) {
        String token = accessToken.getAccessToken();
        try {
            var tokenDb = jwtService.encontrarToken(token);
           if (tokenDb.isPresent() && jwtService.isTokenValido(token)){

               return ResponseEntity.ok(new Response("exito", "Autorizado"));
           }else {
               return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                       .body(new Response("error", "no Autorizado"));
           }

        } catch (Exception ex) {
            log.error("introspect Token", ex);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new Response("error", "no fue posible validar el token"));
        }

    }

    @Operation(summary = "logout del token jwt", responses = {
            @ApiResponse(description = "logout exitosa", responseCode = "200",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TokenRefreshResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication Failure",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Response.class))) })

    @PostMapping(value = "api/logout", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> logout(@Valid @RequestBody TokenRequest  logout) {
        String token = logout.getAccessToken();
        try {
            var tokenDb = jwtService.encontrarToken(token);
            if (tokenDb.isPresent() && jwtService.isTokenValido(token)){
                jwtService.eliminarToken(tokenDb.get());
                return ResponseEntity.ok(new Response("exito", "Sesion cerrada"));
            }else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new Response("error", "no Autorizado"));
            }

        } catch (Exception ex) {
            log.error("introspect Token", ex);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new Response("error", "no fue posible validar el token"));
        }

    }

}