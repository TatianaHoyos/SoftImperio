package com.imperio.service.controlador;

import com.imperio.service.model.dto.LoginRequest;
import com.imperio.service.model.dto.LoginResponse;
import com.imperio.service.model.dto.comun.Response;
import com.imperio.service.model.dto.rol.RolRequest;
import com.imperio.service.model.entity.ProductoEntity;
import com.imperio.service.model.entity.RolEntity;
import com.imperio.service.repository.RolService;
import com.imperio.service.util.FileUploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class ControllerPermisos {
    @Autowired
    private RolService rolService;

    @GetMapping(value = "api/roles", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> obtenerRoles(){
        return ResponseEntity.ok(rolService.obtenerRoles());
    }
    @PostMapping(value = "api/rol/crear", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> crearRol(@RequestBody RolRequest rol) {
        try {
            var rolEntity = new RolEntity();
            rolEntity.setNombreRol (rol.getNombreRol());
            rolEntity.setEstado(rol.getEstado());
            var roldb = rolService.guardarRol(rolEntity);
            if (roldb == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new Response("error", "Error al guardar el rol"));
            } else {
                return ResponseEntity.ok(new Response("exito", "se creo el rol con exito"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("error", "Ha ocurrido un error"));
        }
    }
    @PutMapping (value = "api/rol/actualizar/{id}", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> actualizarRol(@RequestBody RolRequest rol, @PathVariable("id") Integer id) {
        try {
            var rolEntity = new RolEntity();
            rolEntity.setIdRol(id);
            rolEntity.setNombreRol (rol.getNombreRol());
            rolEntity.setEstado(rol.getEstado());
            var roldb = rolService.guardarRol(rolEntity);
            if (roldb == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new Response("error", "Error al actualizar el rol"));
            } else {
                return ResponseEntity.ok(new Response("exito", "se actualizo el rol con exito"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("error", "Ha ocurrido un error"));
        }
    }
    @DeleteMapping("api/rol/eliminar/{id}")
    public ResponseEntity<?> deleteRol(@PathVariable("id") Integer id){
        try {
            rolService.eliminarRol(id);
            return ResponseEntity.ok(new Response("exito", "se elimino el rol con exito"));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("error", "Ha ocurrido un error al intentar eliminar el producto"));
        }


    }
}