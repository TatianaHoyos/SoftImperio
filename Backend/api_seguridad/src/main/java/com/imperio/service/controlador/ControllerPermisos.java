package com.imperio.service.controlador;

import com.imperio.service.model.dto.comun.Response;
import com.imperio.service.model.dto.rol.ConfiguracionRequest;
import com.imperio.service.model.dto.rol.RolRequest;
import com.imperio.service.model.entity.ConfiguracionEntity;
import com.imperio.service.model.entity.RolEntity;
import com.imperio.service.repository.ConfiguracionService;
import com.imperio.service.repository.PermisosService;
import com.imperio.service.repository.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class ControllerPermisos {
    @Autowired
    private RolService rolService;

    @Autowired
    private PermisosService permisosService;
    @Autowired
    private ConfiguracionService configuracionService;

    @GetMapping(value = "api/roles", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> obtenerRoles(){
        return ResponseEntity.ok(rolService.obtenerRoles());
    }

    @GetMapping(value = "api/roles/{id}")
    public ResponseEntity<?> obtenerRolPorId(@PathVariable Integer id) {
        RolEntity rol = rolService.obtenerRolesPorId(id);

        if (rol != null) {
            return ResponseEntity.ok(rol);
        } else {
            return ResponseEntity.notFound().build();
        }
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
            e.printStackTrace();
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
            var rolConsulta=rolService.obtenerRolesPorId(id);
            rolEntity.setPermisos(rolConsulta.getPermisos());
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
    @GetMapping(value = "api/permisos", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> obtenerPermisos(){
        return ResponseEntity.ok(permisosService.obtenerPermisos());
    }

    @PostMapping (value = "api/configuracion/guardar", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> guardarConfiguracion(@RequestBody ConfiguracionRequest configuracion) {
        try {
            configuracionService.eliminarConfiguracion(configuracion.getIdRol());
            for (int i=0; i<configuracion.getPermisos().size();i++){
                var configuracionEntity = new ConfiguracionEntity();
                configuracionEntity.setIdRol(configuracion.getIdRol());
                configuracionEntity.setIdPermisos (configuracion.getPermisos().get(i));
                configuracionEntity.setEstado("Activo");
                var resultadoGuardar = configuracionService.guardarConfiguracion(configuracionEntity);
        if (resultadoGuardar!=null){
            System.out.println("se guardo con exito");
        }else {
            System.out.println("no se guardo");
        }
             /*   var configuraciondb=configuracionService.obtenerConfiguracionPorIdRolYIdPermisos
                        (configuracion.getIdRol(),configuracion.getPermisos().get(i));
                if (configuraciondb==null){
                    var configuracionEntity = new ConfiguracionEntity();
                    configuracionEntity.setIdRol(configuracion.getIdRol());
                    configuracionEntity.setIdPermisos (configuracion.getPermisos().get(i));
                    configuracionEntity.setEstado("Activo");
                    var resultadoGuardar = configuracionService.guardarConfiguracion(configuracionEntity);

                }else {

                }*/

            }
            return  ResponseEntity.ok(new Response("exito", "se guardo el permiso con exito"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("error", "Ha ocurrido un error"));
        }
    }
}
