package com.imperio.service.controlador;

import com.imperio.service.model.dto.*;
import com.imperio.service.repository.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class ControllerLogin {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping(value = "api/login", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(@RequestBody LoginRequest usuario){
        System.out.println("usuario");

        var usuariodb = usuarioService.obtenerUsuario(usuario.getCorreo(), usuario.getPassword());
        if (usuariodb != null ){
            LoginResponse response = new LoginResponse();
            response.setDocumento(usuariodb.getDocumento());
            response.setNombre(usuariodb.getNombre());
            //falta agregar el rol
            //response.setRol(usuariodb.getNombre());
            return ResponseEntity.ok(response);
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new Response("error", "no esta autorizado"));        }
    }
}
