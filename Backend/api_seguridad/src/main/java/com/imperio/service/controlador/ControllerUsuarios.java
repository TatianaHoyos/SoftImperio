package com.imperio.service.controlador;

import com.imperio.service.model.dto.comun.Response;
import com.imperio.service.model.dto.usuarios.UsuariosRequest;
import com.imperio.service.model.entity.UsuariosEntity;
import com.imperio.service.repository.RolService;
import com.imperio.service.repository.UsuariosService;
import com.imperio.service.services.EncryptService;
import com.imperio.service.util.FileUploadUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class ControllerUsuarios {

    @Autowired
    private UsuariosService usuariosService;

    @Autowired
    private RolService rolService;

    @Autowired
    private EncryptService encryptService;

    @Value("${folder.image.users}")
    private String folderImage;

    @PostMapping(value = "api/usuarios/crear", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> crearUsuario( UsuariosRequest usuario,
                                            @RequestParam("foto") MultipartFile multipartFile){
        try {
            var rol= rolService.obtenerRolesPorId(usuario.getIdRol());
            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            fileName = usuario.getNombre()  +"-"+ fileName;

            String password = encryptService.encryptPassword(usuario.getDocumento());
            System.out.println("Contraseña encriptada: "+password);
            String hashPassword = encryptService.createHash(password);


            var usuariosEntity = new UsuariosEntity();
            usuariosEntity.setRol(rol);
            usuariosEntity.setNombre(usuario.getNombre());
            usuariosEntity.setDocumento(usuario.getDocumento());
            usuariosEntity.setEmail(usuario.getEmail());
            usuariosEntity.setTelefono(usuario.getTelefono());
            usuariosEntity.setFoto(folderImage + fileName);
            usuariosEntity.setPassword(hashPassword);
            usuariosEntity.setEstado("Activo");

            var usuariodb = usuariosService.crearUsuario(usuariosEntity);
            //Se guarda la foto en una carpeta del servidor
            FileUploadUtil.saveFile(folderImage, fileName, multipartFile);

            if (usuariodb == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new Response("error", "Error al guardar el usuario"));
            } else {
                return ResponseEntity.ok(new Response("exito", "se creo el usuario con exito"));
            }
        } catch (Exception e) {
            log.error("Crear usuario",e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("error", "Ha ocurrido un error"));
        }
    }


    @GetMapping(value = "api/usuarios/consultar", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> obtenerUsurios(){
        return ResponseEntity.ok(usuariosService.obtenerUsuarios());
    }

    @GetMapping(value = "api/usuarios/consultar/{id}")
    public ResponseEntity<?> obtenerUsuarioPorId(@PathVariable Integer id) {
        UsuariosEntity usuario = usuariosService.obtenerUsuarioPorId(id);

        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("api/usuarios/eliminar/{id}")
    public ResponseEntity<?> deleteUsuario(@PathVariable("id") Integer id){
        try {
            usuariosService.eliminarUsuario(id);
            return ResponseEntity.ok(new Response("exito", "se elimino el usuario con exito"));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("error", "Ha ocurrido un error al intentar eliminar el usuario"));
        }

    }

    @PutMapping(value = "api/usuarios/actualizar/{id}", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUsuarios( UsuariosRequest usuario,
                                              @PathVariable("id") Integer id,
                                              @RequestParam("foto") MultipartFile multipartFile) throws Exception {

        try {
            var rol= rolService.obtenerRolesPorId(usuario.getIdRol());
            String uploadDir = "usuarios-photos/";
            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            fileName = usuario.getNombre()  +"-"+ fileName;

            String password = encryptService.encryptPassword(usuario.getDocumento());
            System.out.println("Contraseña encriptada: "+password);
            String hashPassword = encryptService.createHash(password);

            var usuariosEntity = new UsuariosEntity();
            usuariosEntity.setIdUsuarios(id);
            usuariosEntity.setRol(rol);
            usuariosEntity.setNombre(usuario.getNombre());
            usuariosEntity.setDocumento(usuario.getDocumento());
            usuariosEntity.setEmail(usuario.getEmail());
            usuariosEntity.setTelefono(usuario.getTelefono());
            usuariosEntity.setFoto(uploadDir + fileName);
            usuariosEntity.setPassword(hashPassword);
            usuariosEntity.setEstado(usuario.getEstado());

            var usuariodb = usuariosService.crearUsuario(usuariosEntity);
            FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);

            if (usuariodb == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new Response("error", "Error al actualizar el usuario"));
            } else {
                return ResponseEntity.ok(new Response("exito", "se actualizó el usuario con exito"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("error", "Ha ocurrido un error al actualizar el usuario"));
        }
    }
}