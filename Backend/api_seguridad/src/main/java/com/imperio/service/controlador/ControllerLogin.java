package com.imperio.service.controlador;

import com.imperio.service.model.dto.*;
import com.imperio.service.model.dto.LoginRequest;
import com.imperio.service.model.dto.comun.Response;
import com.imperio.service.model.dto.usuarios.UsuariosRequest;
import com.imperio.service.model.entity.UsuariosEntity;
import com.imperio.service.repository.RolService;
import com.imperio.service.repository.UsuariosService;
import com.imperio.service.util.FileUploadUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class ControllerLogin {

    @Autowired
    private UsuariosService usuariosService;

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
    public ResponseEntity<?> login(@RequestBody LoginRequest usuarios) {
        System.out.println("usuarios");

        var usuariodb = usuariosService.obtenerUsuarioLogin(usuarios.getCorreo(),
                usuarios.getPassword());
        if (usuariodb != null) {
            LoginResponse response = new LoginResponse();
            response.setDocumento(usuariodb.getDocumento());
            response.setNombre(usuariodb.getNombre());
            response.setFoto(urlServer + usuariodb.getFoto());
            response.setRol(usuariodb.getIdRol());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new Response("error", "no esta autorizado"));
        }
    }

}