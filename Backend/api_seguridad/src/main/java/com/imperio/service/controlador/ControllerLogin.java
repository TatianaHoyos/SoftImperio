package com.imperio.service.controlador;

import com.imperio.service.model.dto.*;
import com.imperio.service.model.dto.LoginRequest;
import com.imperio.service.model.dto.comun.Response;
import com.imperio.service.model.dto.usuarios.UsuariosRequest;
import com.imperio.service.model.entity.UsuariosEntity;
import com.imperio.service.repository.RolService;
import com.imperio.service.repository.UsuariosService;
import com.imperio.service.util.FileUploadUtil;
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
/*
    @PostMapping(value = "api/usuarios/crear", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> crearUsuario(UsuariosRequest usuario,
                                          @RequestParam("foto") MultipartFile multipartFile) {
        try {
            String uploadDir = "user-photos/";
            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            fileName = usuario.getDocumento() + "-" + fileName;

            var usuariosEntity = new UsuariosEntity();
            usuariosEntity.setNombre(usuario.getNombre());
            usuariosEntity.setDocumento(usuario.getDocumento());
            usuariosEntity.setEmail(usuario.getEmail());
            usuariosEntity.setPassword(usuario.getDocumento());
            usuariosEntity.setIdRol(usuario.getIdRol());
            usuariosEntity.setEstado("activo");
            usuariosEntity.setFoto(uploadDir + fileName);
            usuariosEntity.setTelefono(usuario.getTelefono());

            var usuaridb = usuariosService.crearUsuario(usuariosEntity);
            //Se guarda la foto en una carpeta del servidor
            FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);

            if (usuaridb == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new Response("error", "Error al guardar el usuario"));
            } else {
                return ResponseEntity.ok(new Response("exito", "se creo el usuario con exito"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("error", "Ha ocurrido un error"));
        }
    }

    @PostMapping(value = "api/login", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(@RequestBody LoginRequest usuarios) {
        System.out.println("usuarios");

        var usuariodb = usuariosService.obtenerUsuarios(usuarios.getCorreo(), usuarios.getPassword());
        if (usuariodb != null) {
            LoginResponse response = new LoginResponse();
            response.setDocumento(usuariodb.getDocumento());
            response.setNombre(usuariodb.getNombre());
            response.setFoto(urlServer + usuariodb.getFoto());
            //falta agregar el rol
            response.setRol(usuariodb.getIdRol());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new Response("error", "no esta autorizado"));
        }
    }*/

}