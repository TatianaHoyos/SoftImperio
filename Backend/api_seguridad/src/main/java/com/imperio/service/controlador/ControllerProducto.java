package com.imperio.service.controlador;

import com.imperio.service.model.dto.comun.Response;
import com.imperio.service.model.dto.producto.ProductoRequest;
import com.imperio.service.model.dto.usuarios.UsuariosRequest;
import com.imperio.service.model.entity.ExistenciasEntity;
import com.imperio.service.model.entity.ProductoEntity;
import com.imperio.service.model.entity.UsuariosEntity;
import com.imperio.service.repository.ExistenciasRepository;
import com.imperio.service.repository.ExistenciasService;
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
    @Autowired
    private ExistenciasService existenciasService;
    private String urlServer = "http://localhost:8080/";

    @PostMapping(value = "api/producto/crear", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> crearProducto( ProductoRequest producto,
                                           @RequestParam("foto") MultipartFile multipartFile){
        try {
            var productoDuplicado = productoService.obtenerProductoDuplicado(producto.getNombreProducto(),
                    producto.getReferenciaProducto());
            if (productoDuplicado != null && !productoDuplicado.isEmpty()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new Response("error", "Ya existe un producto igual"));
            }
            String uploadDir = "producto-photos/";
            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            fileName = producto.getNombreProducto()  +"-"+ producto.getReferenciaProducto().concat(fileName);


            var productoEntity = new ProductoEntity();
            productoEntity.setIdCategoria (producto.getIdCategoria());
            //productoEntity.setIdProveedores(producto.getIdProveedores());
            productoEntity.setNombreProducto(producto.getNombreProducto());
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
                var existenciaEntity = new ExistenciasEntity();
                existenciaEntity.setProductos(productodb);
                existenciaEntity.setStock(producto.getStockMinimo());
                existenciaEntity.setCantidad(0);
                existenciaEntity.setEstado("Activo");
                var existenciaDb = existenciasService.crearExistencia(existenciaEntity);

                if (existenciaDb != null) {
                    return ResponseEntity.ok(new Response("exito", "se creo el producto con exito"));
                } else {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body(new Response("error", "Error relacionar el producto en existencia"));
                }

            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("error", "Ha ocurrido un error"));
        }
    }


    @GetMapping(value = "api/producto/consultar", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> obtenerProductos(){
        return ResponseEntity.ok(productoService.obtenerProductosCantidades());
    }

    @DeleteMapping("api/producto/eliminar/{id}")
    public ResponseEntity<?> deleteProducto(@PathVariable("id") Integer id){
        try {
            productoService.eliminarProductos(id);
            return ResponseEntity.ok(new Response("exito", "se elimino el producto con exito"));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("error", "Ha ocurrido un error al intentar eliminar el producto"));
        }


    }

    @PutMapping(value = "api/producto/actualizar/{id}", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProductos(ProductoRequest producto,
                                             @PathVariable("id") Integer id,
                                             @RequestParam("foto") MultipartFile multipartFile) throws Exception {

        try {
            var productoDuplicado = productoService.obtenerProductoDuplicado(producto.getNombreProducto(),
                    producto.getReferenciaProducto());
            if (productoDuplicado != null && !productoDuplicado.isEmpty()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new Response("error", "Ya existe un producto igual"));
            }
            String uploadDir = "producto-photos/";
            String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
            fileName = producto.getNombreProducto()  +"-"+ producto.getReferenciaProducto().concat(fileName);

            var productoEntity = new ProductoEntity();
            productoEntity.setIdProductos(id);
            productoEntity.setIdCategoria (producto.getIdCategoria());
            productoEntity.setNombreProducto(producto.getNombreProducto());
            productoEntity.setPrecioProducto(producto.getPrecioProducto());
            productoEntity.setFotoProducto(uploadDir + fileName);
            productoEntity.setReferenciaProducto(producto.getReferenciaProducto());

            var productodb = productoService.crearProducto(productoEntity);
            FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);

            if (productodb == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new Response("error", "Error al actualizar el producto"));
            } else {
                var existenciaDb = existenciasService.encontrarExistenciaPorProducto(productodb);
                existenciaDb.setStock(producto.getStockMinimo());
                var existenciaDbActualizada = existenciasService.crearExistencia(existenciaDb);

                if (existenciaDbActualizada != null) {
                    return ResponseEntity.ok(new Response("exito", "se actualizo el producto con exito"));
                } else {
                    return ResponseEntity.ok(new Response("exito", "se actualizo el producto pero no el stock en existencia"));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("error", "Ha ocurrido un error al actualizar el producto"));
        }
    }
}


