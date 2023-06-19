package com.imperio.service.controlador;

import com.imperio.service.model.dto.comun.Response;
import com.imperio.service.model.dto.producto.ProductoRequest;
import com.imperio.service.model.dto.usuario.UsuarioRequest;
import com.imperio.service.model.entity.ProductoEntity;
import com.imperio.service.model.entity.UsuarioEntity;
import com.imperio.service.repository.ProductoService;
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
    private ProductoService productoService;

    @PostMapping(value = "api/producto/crear", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> crearProducto( ProductoRequest producto,
                                           @RequestParam("foto") MultipartFile multipartFile){
        try {
            String uploadDir = "producto-photos/";
            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            fileName = producto.getNombreProducto()  +"-"+ fileName;


            var productoEntity = new ProductoEntity();
            productoEntity.setIdCategoria (producto.getIdCategoria());
            productoEntity.setIdProveedores(producto.getIdProveedores());
            productoEntity.setNombreProducto(producto.getNombreProducto());
            productoEntity.setCantidad(0);
            productoEntity.setPrecioProducto(producto.getPrecioProducto());
            productoEntity.setFotoProducto(uploadDir + fileName);
            productoEntity.setReferenciaProducto(producto.getReferenciaProducto());

            var productodb = productoService.crearProducto(productoEntity);
            //Se guarda la foto en una carpeta del servidor
            FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);

            if (productodb == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new Response("error", "Error al guardar el producto"));
            } else {
                return ResponseEntity.ok(new Response("exito", "se creo el producto con exito"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("error", "Ha ocurrido un error"));
        }
    }

}
