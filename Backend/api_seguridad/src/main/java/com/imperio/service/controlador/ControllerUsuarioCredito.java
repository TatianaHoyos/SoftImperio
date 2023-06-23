package com.imperio.service.controlador;

import com.imperio.service.model.dto.comun.Response;
import com.imperio.service.model.dto.usuariocredito.UsuarioCreditoRequest;
import com.imperio.service.model.dto.usuario.UsuarioRequest;
import com.imperio.service.model.entity.UsuarioCreditoEntity;
import com.imperio.service.model.entity.UsuarioEntity;
import com.imperio.service.repository.UsuarioCreditoService;
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
public class ControllerProducto {

    @Autowired
    private UsuarioCreditoService usuariocreditoService;
    private String urlServer = "http:localhost:3306/";

    @PostMapping(value = "api/usuariocredito/crear", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> crearUsuarioCredito( UsuarioCreditoRequest usuariocredito){

        try {

            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            fileName = usuariocredito.getNombre()  +"-"+ fileName;


            var usuariocreditoEntity = new UsuarioCreditoEntity();
            usuariocreditoEntity.setIdUsuarioCredito (usuariocredito.getIdUsuarioCredito());
            usuariocreditoEntity.setNombre(usuariocredito.getNombre());
            usuariocreditoEntity.setDocumento(usuariocredito.getDocumento());
            usuariocreditoEntity.setTelefono(usuariocredito.getTelefono());


            var usuariocreditodb = usuariocreditoService.crearUsuarioCredito(usuariocreditoEntity);


            if (usuariocreditodb == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new Response("error", "Error al guardar el usuario"));
            } else {
                return ResponseEntity.ok(new Response("se creo el usuario con exito"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("error", "Ha ocurrido un error"));
        }
    }


    @GetMapping(value = "api/usuariocredito/consultar", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> obtenerUsuarioCredito(){
        return ResponseEntity.ok(usuariocreditoService.obtenerUsuarioCredito());
    }

    @DeleteMapping("api/usuariocredito/eliminar/{id}")
    public ResponseEntity<?> deleteUsuarioCredito(@PathVariable("id") Integer id){
        try {
            usuariocreditoService.eliminarUsuarioCredito(id);
            return ResponseEntity.ok(new Response("se elimino el usuario con exito"));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("Ha ocurrido un error al intentar eliminar el producto"));
        }


    }

    @PutMapping(value = "api/usuariocredito/actualizar/{id}", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUsuarioCredito( UsuarioCreditoRequest usuariocredito,
                                              @PathVariable("id") Integer id {

        try {
            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            fileName = usuariocredito.getNombre()  +"-"+ fileName;

            var usuariocreditoEntity = new UsuarioCreditoEntity();
            usuariocreditoEntity.setIdUsuarioCredito (IdUsuarioCredito);
            usuariocreditoEntity.setNombre(usuariocredito.getNombre());
            usuariocreditoEntity.setDocumento(usuariocredito.getDocumento());
            usuariocreditoEntity.setTelefono(usuariocredito.getTelefono());

            var usuariocreditodb = usuariocreditoService.crearUsuarioCredito(usuariocreditoEntity);


            if (usuariocreditodb == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new Response("Error al actualizar el usuario"));
            } else {
                return ResponseEntity.ok(new Response("se actualizo el usuario con exito"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("Ha ocurrido un error al actualizar el producto"));
        }
    }
}


