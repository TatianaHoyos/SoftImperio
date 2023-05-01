package com.imperio.service.controlador;

import com.imperio.service.model.dto.*;
import com.imperio.service.repository.CategoriaService;
import com.imperio.service.repository.ProductoService;
import com.imperio.service.repository.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class ControllerLogin {

    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private ProductoService productoService;
    @Autowired
    private CategoriaService categoriaService;

    @PostMapping(value = "api/login", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Response> login(@RequestBody UsuarioLogin usuario){
        System.out.println("usuario");

        var usuariodb = usuarioService.obtenerUsuario(usuario.getCorreo(), usuario.getPassword());
        if (usuariodb != null ){
            return ResponseEntity.ok(new Response("Exito", "Registro exitoso"));
        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new Response("error", "no esta autorizado"));        }
    }


    @GetMapping(value = "api/producto", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ListaProductosResponse> getproductocategoria(@RequestParam("idCategoria") int idCategoria) {
        var productodb = productoService.obtenerProductoCategoria(idCategoria);
        if (productodb == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        ListaProductosResponse productoCategoria = new ListaProductosResponse();
        List<ProductoResponce> listaProductos = new ArrayList<>();

        productodb.forEach(productoEntity -> {
            ProductoResponce producto = new ProductoResponce();
            producto.setId(productoEntity.getIdProducto());
            producto.setIdCategoria(productoEntity.getIdCategoria());
            producto.setNombre(productoEntity.getNombreProducto());
            producto.setReferencia(productoEntity.getReferenciaProducto());
            producto.setPrecio(productoEntity.getPrecioProducto());

            listaProductos.add(producto);

        });

        productoCategoria.setProductos(listaProductos);

        return ResponseEntity.ok(productoCategoria);
    }

    @GetMapping(value = "api/producto/{nombre}", produces = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<ProductoResponce> getNombre(@PathVariable("nombre") String nombre){

        var productodb = productoService.obtenerProducto(nombre);
        if (productodb==null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ProductoResponce());
        }
        ProductoResponce producto= new ProductoResponce();
        producto.setId(productodb.getIdProducto());
        producto.setIdCategoria(productodb.getIdCategoria());
        producto.setNombre(productodb.getNombreProducto());
        producto.setReferencia(productodb.getReferenciaProducto());
        producto.setFoto(productodb.getFotoProducto());
        producto.setPrecio(productodb.getPrecioProducto());
        return ResponseEntity.ok(producto);
    }

    @GetMapping(value = "api/categorias", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CategoriaResponse> getCategorias(){

        var categoriadb = categoriaService.obtenerAllCategoria();
        if (categoriadb==null || categoriadb.size()==0){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body( null);
        }
        CategoriaResponse categorias= new CategoriaResponse();
        categorias.setCategorias(categoriadb);
        return ResponseEntity.ok(categorias);
    }
}
