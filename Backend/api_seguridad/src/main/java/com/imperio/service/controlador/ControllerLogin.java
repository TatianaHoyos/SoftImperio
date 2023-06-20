package com.imperio.service.controlador;

import com.imperio.service.model.dto.*;
import com.imperio.service.model.dto.comun.Response;
import com.imperio.service.model.dto.usuario.UsuarioRequest;
import com.imperio.service.model.entity.UsuarioEntity;
import com.imperio.service.repository.RolService;
import com.imperio.service.repository.UsuarioService;
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
    private UsuarioService usuarioService;



    private String urlServer = "http:localhost:8080/";

    @PostMapping(value = "api/usuario/crear", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> crearUsuario(UsuarioRequest usuario,
                                          @RequestParam("foto") MultipartFile multipartFile) {
        try {
            String uploadDir = "user-photos/";
            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            fileName = usuario.getDocumento() + "-" + fileName;

            var usuarioEntity = new UsuarioEntity();
            usuarioEntity.setNombre(usuario.getNombre());
            usuarioEntity.setDocumento(usuario.getDocumento());
            usuarioEntity.setEmail(usuario.getEmail());
            usuarioEntity.setPassword(usuario.getDocumento());
            usuarioEntity.setIdRol(usuario.getIdRol());
            usuarioEntity.setEstado("activo");
            usuarioEntity.setFoto(uploadDir + fileName);
            usuarioEntity.setTelefono(usuario.getTelefono());

            var usuaridb = usuarioService.crearUsuario(usuarioEntity);
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
    public ResponseEntity<?> login(@RequestBody LoginRequest usuario) {
        System.out.println("usuario");

        var usuariodb = usuarioService.obtenerUsuario(usuario.getCorreo(), usuario.getPassword());
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
    }

}