package com.imperio.service.controlador;

import com.imperio.service.model.dto.*;
import com.imperio.service.model.entity.UsuarioEntity;
import com.imperio.service.repository.RolService;
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

    @Autowired
    private RolService rolService;

    @PostMapping(value = "api/usuario/crear", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> crearUsuario(@RequestBody UsuarioRequest usuario){
        var usuarioEntity= new UsuarioEntity();
        usuarioEntity.setNombre(usuario.getNombre());
        usuarioEntity.setDocumento(usuario.getDocumento());
        usuarioEntity.setEmail(usuario.getEmail());
        usuarioEntity.setPassword(usuario.getDocumento());
        usuarioEntity.setIdRol(usuario.getIdRol());
        usuarioEntity.setEstado("activo");
        usuarioEntity.setFoto(usuario.getFoto());
        usuarioEntity.setTelefono(usuario.getTelefono());
        var usuaridb=usuarioService.crearUsuario(usuarioEntity);
        if (usuaridb==null){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("error", "nose pudo agregar la informacion"));
        }else {
            return ResponseEntity.ok(new Response("exito","se creo el usuario con exito"));
        }
    }
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
            response.setRol(usuariodb.getIdRol());
            return ResponseEntity.ok(response);
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new Response("error", "no esta autorizado"));
        }
    }

    @GetMapping(value = "api/roles", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> obtenerRoles(){
        return ResponseEntity.ok(rolService.obtenerRoles());
    }
}
