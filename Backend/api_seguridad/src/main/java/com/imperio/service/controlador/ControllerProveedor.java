package com.imperio.service.controlador;

import com.imperio.service.model.dto.comun.Response;
import com.imperio.service.model.dto.proveedor.ProveedorRequest;
import com.imperio.service.model.dto.usuario.UsuarioRequest;
import com.imperio.service.model.entity.ProveedoresEntity;
import com.imperio.service.model.entity.UsuarioEntity;
import com.imperio.service.repository.ProveedorService;
import com.imperio.service.util.FileUploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class ControllerProveedor {

    @Autowired
    private ProveedorService ProveedorService;
    private String urlServer = "http://localhost:8080/";

    @PostMapping(value = "api/proveedor/crear", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> crearProveedor(@RequestBody ProveedorRequest proveedor){

        try {

            var proveedoresEntity = new ProveedoresEntity();
            proveedoresEntity.setIdProveedores(proveedor.getIdProveedores());
            proveedoresEntity.setNombre(proveedor.getNombre());
            proveedoresEntity.setDocumento(proveedor.getDocumento());
            proveedoresEntity.setEmail(proveedor.getEmail());
            proveedoresEntity.setDireccion(proveedor.getDireccion());
            proveedoresEntity.setTelefono(proveedor.getTelefono());

            var proveedordb = ProveedorService.crearProveedor(proveedoresEntity);

            if (proveedordb == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new Response("error", "Error al guardar el proveedor"));
            } else {
                return ResponseEntity.ok(new Response("exito", "se creó el proveedor con exito"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("error", "Ha ocurrido un error"));
        }
    }

    @GetMapping(value = "api/proveedorconsultar", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> obtenerProveedores(){
        return ResponseEntity.ok(ProveedorService.obtenerProveedores());
    }

    @GetMapping(value = "api/proveedorconsultar/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> obtenerProveedor(@PathVariable("id") Integer id){
        return ResponseEntity.ok(ProveedorService.obtenerProveedor(id));
    }



    @DeleteMapping("api/proveedor/eliminar/{id}")
    public ResponseEntity<?> deleteProveedor(@PathVariable("id") Integer id){
        try {
            ProveedorService.eliminarProveedores(id);
            return ResponseEntity.ok(new Response("exito", "se eliminó el proveedor con exito"));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("error", "Ha ocurrido un error al intentar eliminar el proveedor"));
        }
    }

    @PutMapping(value = "api/proveedor/actualizar/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateProveedor(@RequestBody ProveedorRequest proveedor,@PathVariable("id") Integer id){

        try {
            var proveedoresEntity = new ProveedoresEntity();
            proveedoresEntity.setIdProveedores(id);
            proveedoresEntity.setNombre(proveedor.getNombre());
            proveedoresEntity.setDocumento(proveedor.getDocumento());
            proveedoresEntity.setEmail(proveedor.getEmail());
            proveedoresEntity.setDireccion(proveedor.getDireccion());
            proveedoresEntity.setTelefono(proveedor.getTelefono());

            var proveedordb = ProveedorService.crearProveedor(proveedoresEntity);

            if (proveedordb == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new Response("error", "Error al actualizar el proveedor"));
            } else {
                return ResponseEntity.ok(new Response("exito", "se actualizó el proveedor con exito"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("error", "Ha ocurrido un error al actualizar el proveedor"));
        }
    }
}

