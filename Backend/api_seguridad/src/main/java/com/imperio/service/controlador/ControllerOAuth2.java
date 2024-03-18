package com.imperio.service.controlador;

import com.imperio.service.model.dto.oauth2.Authoritation;
import com.imperio.service.model.dto.login.LoginRequest;
import com.imperio.service.model.dto.comun.Response;
import com.imperio.service.model.dto.login.LoginResponse;
import com.imperio.service.model.dto.oauth2.TokenRefreshRequest;
import com.imperio.service.model.dto.oauth2.TokenRefreshResponse;
import com.imperio.service.model.dto.oauth2.TokenRequest;
import com.imperio.service.model.dto.rol.RolResponse;
import com.imperio.service.model.entity.OAuthEntity;
import com.imperio.service.model.entity.PermisosEntity;
import com.imperio.service.oauth2.jwt.JwtService;
import com.imperio.service.oauth2.refresh.RefreshTokenService;
import com.imperio.service.repository.RolService;
import com.imperio.service.repository.UsuariosService;
import com.imperio.service.services.EncryptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Map;

import org.springframework.web.bind.annotation.RequestParam;
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
    @Autowired
    private RolService rolService;

    @Value("${security.clientId}")
    private String clientId;

    @Value("${security.clientSecret}")
    private String clientSecret;

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
                    response.setFoto(usuariodb.getFoto());
                    response.setRol(usuariodb.getRol());
                   // response.setRol(usuariodb.getIdRol());

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
    @SecurityRequirement(name = "basicAuth")
    @Operation(summary = "Refresh del token jwt", responses = {
            @ApiResponse(description = "Refresh del token exitosa", responseCode = "200",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TokenRefreshResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication Failure",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Response.class))) })

    @PostMapping(value = "api/refreshToken",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> refreshToken(@RequestHeader("authorization") String authorizationHeader,
                                          @ModelAttribute TokenRefreshRequest token) {
        ResponseEntity<?> responseEntity = validarCabeceraYContenido(authorizationHeader);
        if (responseEntity != null) {
            return responseEntity; // Devolver la respuesta de error si hay algún problema
        }

        try {
            var tokenRefreshResponseJwt = refreshTokenService.encontrarTokenRefresh(token.getRefreshToken())
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
    @SecurityRequirement(name = "basicAuth")
    @Operation(summary = "Introspect del token jwt",
            parameters = {
                    @Parameter(in = ParameterIn.HEADER, name = "authorization", description = "clientId clientSecret en base64",
                            schema = @Schema(implementation = String.class), required = true),
                    },
            responses = {
            @ApiResponse(description = "introspect del token exitosa", responseCode = "200",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TokenRefreshResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication Failure",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Response.class))) })

    @PostMapping(value = "api/introspectToken",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> introspectToken(@RequestHeader Map<String,String> headers,
                                         @ModelAttribute TokenRequest token) {
        ResponseEntity<?> responseEntity = validarCabeceraYContenido(headers.get("authorization"));
        if (responseEntity != null) {
            return responseEntity; // Devolver la respuesta de error si hay algún problema
        }

        try {
            var tokenDb = jwtService.encontrarToken(token.getAccessToken());
            if (tokenDb.isPresent() && jwtService.isTokenValido(token.getAccessToken())) {
                 // todo: aca debo validar si el rol tiene permisos necesarios para la operacion
                Map<String,Object> extraClaims = jwtService.extraerDatosUsuarios(token.getAccessToken());
                var rolFromJwt =  (String) extraClaims.get("Rol");
                var idRolFromJwt =  (Integer) extraClaims.get("IdRol");

                if (!hasPermission(token, idRolFromJwt)){
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(new Response("error", "Su rol no permite esta operación"));
                }

                return ResponseEntity.ok(new Response("exito", "Autorizado"));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new Response("error", "no Autorizado"));
            }
        } catch (Exception ex) {
            log.error("introspect Token", ex);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new Response("error", "no fue posible validar el token"));
        }
    }

    private boolean hasPermission(TokenRequest token, Integer idRolFromJwt) {
        var rol= rolService.obtenerRolesPorId(idRolFromJwt);
        var tienePermisos = false;
        for (PermisosEntity permisos : rol.getPermisos()){
           if (permisos.getAcciones().getNombre().equals(token.getAccion()) &&
                    permisos.getModulo().getNombre().equals(token.getModulo())){
                tienePermisos = true;
                break;
           }


        }
        return tienePermisos;
    }


    @SecurityRequirement(name = "basicAuth")
    @Operation(summary = "logout del token jwt", responses = {
            @ApiResponse(description = "logout exitosa", responseCode = "200",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TokenRefreshResponse.class))),
            @ApiResponse(responseCode = "401", description = "Authentication Failure",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = Response.class))) })

    @PostMapping(value = "api/logout",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> logout(@RequestHeader("authorization") String authorizationHeader,
                                           @ModelAttribute TokenRequest token) {
        ResponseEntity<?> responseEntity = validarCabeceraYContenido( authorizationHeader);
        if (responseEntity != null) {
            return responseEntity; // Devolver la respuesta de error si hay algún problema
        }
        try {
            var tokenDb = jwtService.encontrarToken(token.getAccessToken());
            if (tokenDb.isPresent() && jwtService.isTokenValido(token.getAccessToken())){
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

    private ResponseEntity<?> validarCabeceraYContenido(String authorizationHeader) {
        // Validar la cabecera Authorization con el esquema Basic
        if (!authorizationHeader.startsWith("Basic ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new Response("error", "Esquema de autenticación no compatible. Utilice Basic Authentication"));
        }

        // Decodificar las credenciales de cliente desde la cabecera Authorization
        String base64Credentials = authorizationHeader.substring("Basic ".length()).trim();
        String credentials = new String(Base64.getDecoder().decode(base64Credentials), StandardCharsets.UTF_8);

        // Separar las credenciales en clientId y clientSecret
        String[] values = credentials.split(":", 2);
        String clientId = values[0];
        String clientSecret = values[1];

        // Validar las credenciales del cliente
        if (!clientId.equals(this.clientId) || !clientSecret.equals(this.clientSecret)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new Response("error", "Credenciales de cliente no válidas"));
        }

        return null; // Todo está correcto
    }



}