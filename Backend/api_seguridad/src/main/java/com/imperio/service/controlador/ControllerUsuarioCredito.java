package com.imperio.service.controlador;

import com.imperio.service.model.dto.comun.Response;
import com.imperio.service.model.dto.usuariocredito.UsuarioCreditoRequest;

import com.imperio.service.model.entity.UsuarioCreditoEntity;
import com.imperio.service.repository.UsuarioCreditoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class ControllerUsuarioCredito {

    @Autowired
    private UsuarioCreditoService usuariocreditoService;
    private String urlServer = "http:localhost:8080/";

    @PostMapping(value = "api/usuariocredito/crear", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> crearUsuarioCredito(@RequestBody UsuarioCreditoRequest usuariocredito){

        try {

            var usuariocreditoEntity = new UsuarioCreditoEntity();
            usuariocreditoEntity.setNombre(usuariocredito.getNombre());
            usuariocreditoEntity.setDocumento(usuariocredito.getDocumento());
            usuariocreditoEntity.setTelefono(usuariocredito.getTelefono());


            var usuariocreditodb = usuariocreditoService.crearUsuarioCredito(usuariocreditoEntity);


            if (usuariocreditodb == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new Response("error", "Error al guardar el usuario"));
            } else {
                return ResponseEntity.ok(new Response("Bien", "se creo el usuario con exito"));
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
            return ResponseEntity.ok(new Response("Bien", "se elimino el usuario con exito"));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("Error","Ha ocurrido un error al intentar eliminar el producto"));
        }


    }

    @PutMapping(value = "api/usuariocredito/actualizar/{id}", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateUsuarioCredito(UsuarioCreditoRequest usuariocredito,
                                                  @PathVariable("id") Integer id){

        try {
            var usuariocreditoEntity = new UsuarioCreditoEntity();
            usuariocreditoEntity.setIdUsuarioCredito (id);
            usuariocreditoEntity.setNombre(usuariocredito.getNombre());
            usuariocreditoEntity.setDocumento(usuariocredito.getDocumento());
            usuariocreditoEntity.setTelefono(usuariocredito.getTelefono());

            var usuariocreditodb = usuariocreditoService.crearUsuarioCredito(usuariocreditoEntity);


            if (usuariocreditodb == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new Response("Error","Error al actualizar el usuario"));
            } else {
                return ResponseEntity.ok(new Response("Bien", "se actualizo el usuario con exito"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("Error","Ha ocurrido un error al actualizar el usuario"));
        }
    }
}


