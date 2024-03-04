package com.imperio.service.controlador;

import com.imperio.service.model.dto.comun.Response;
import com.imperio.service.model.dto.producto.ProductoRequest;
import com.imperio.service.model.dto.producto.ProductoResponse;
import com.imperio.service.model.entity.ExistenciasEntity;
import com.imperio.service.model.entity.ProductoEntity;
import com.imperio.service.services.pdf.PdfUtil;
import com.imperio.service.repository.CategoriaService;
import com.imperio.service.repository.ExistenciasService;
import com.imperio.service.repository.ProductoService;
import com.imperio.service.services.pdf.model.ProductoReporte;
import com.imperio.service.util.FileUploadUtil;
import com.itextpdf.io.exceptions.IOException;
import com.itextpdf.io.source.ByteArrayOutputStream;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.net.MalformedURLException;
import java.sql.Array;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Locale;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class ControllerProducto {

    @Autowired
    private ProductoService productoService;
    @Autowired
    private ExistenciasService existenciasService;

    @Autowired
    private CategoriaService categoriaService;

    @Autowired
    private PdfUtil pdfUtil;

    private String urlServer = "http://localhost:8080/";

    static Locale colombianLocale = new Locale("es", "CO");
    static NumberFormat colombianCurrencyFormat = NumberFormat.getCurrencyInstance(colombianLocale);

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

            var categoria = categoriaService.obtenerCategoriaId(producto.getIdCategoria());


            var productoEntity = new ProductoEntity();
            productoEntity.setCategoria (categoria);
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
        var existenciaDB = new ExistenciasEntity();
        try {
            var productoDb = productoService.obtenerProductoPorId(id);
            if (productoDb.isPresent()) {
                existenciaDB = existenciasService.encontrarExistenciaPorProducto(productoDb.get());
                if (existenciaDB.getCantidad() == 0) {
                    var filePicture = existenciaDB.getProductos().getFotoProducto();
                    existenciasService.eliminarExistenciaYProducto(existenciaDB);
                    FileUploadUtil.deleteFile(filePicture);
                    return ResponseEntity.ok(new Response("exito", "se elimino el producto con exito"));
                } else {
                    return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY)
                            .body(new Response("error", "No se puede eliminar el producto ya que tiene candidades en existencias"));
                }
            } else {
                return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY)
                        .body(new Response("error", "No fue posible eliminar el producto"));
            }

        }
        catch (DataIntegrityViolationException e) {
            existenciaDB.setEstado("Inactivo");
            var existenciaUpdated = existenciasService.crearExistencia(existenciaDB);
            if (existenciaUpdated != null) {
                return ResponseEntity.status(HttpStatus.OK)
                        .body(new Response("error", "No es posible eliminar el producto, pero su estado se cambio a inactivo"));
            } else {
                return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY)
                        .body(new Response("error", "No es posible eliminar el producto, debido a que hay una compra relacionada a existencia"));
            }
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new Response("error", "Ha ocurrido un error al intentar eliminar el producto"));
        }


    }

    @PutMapping(value = "api/producto/actualizar/{id}", produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProductos(ProductoRequest producto,
                                             @PathVariable("id") Integer id,
                                             @RequestParam(name = "foto", required = false) MultipartFile multipartFile) throws Exception {

        try {
            var productoDuplicado = productoService.obtenerProductoDuplicado(producto.getNombreProducto(),
                    producto.getReferenciaProducto());
            if (productoDuplicado != null && !productoDuplicado.isEmpty() && productoDuplicado.get(0).getIdProductos() != id) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(new Response("error", "Ya existe un producto igual"));
            }

            var productoDB = productoService.obtenerProductoPorId(id);

            if (productoDB.isEmpty()) {
                return ResponseEntity.status(HttpStatus.FAILED_DEPENDENCY)
                        .body(new Response("error", "Error al actualizar el producto, No se cuentra nigún producto con ese id"));
            }

            var productoEntity = new ProductoEntity();
            if (multipartFile != null && !multipartFile.isEmpty()) {
                String uploadDir = "producto-photos/";
                String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
                fileName = producto.getNombreProducto() + "-" + producto.getReferenciaProducto().concat(fileName);
                productoEntity.setFotoProducto(uploadDir + fileName);

                FileUploadUtil.deleteFile(productoDB.get().getFotoProducto());
                FileUploadUtil.saveFile(uploadDir, fileName, multipartFile);
            } else {
                // La imagen no llego para ser actualizada
                productoEntity.setFotoProducto(productoDB.get().getFotoProducto());
            }

            var categoria = categoriaService.obtenerCategoriaId(producto.getIdCategoria());
            productoEntity.setIdProductos(id);
            productoEntity.setCategoria(categoria);
            productoEntity.setNombreProducto(producto.getNombreProducto());
            productoEntity.setPrecioProducto(producto.getPrecioProducto());
            productoEntity.setReferenciaProducto(producto.getReferenciaProducto());

            var productodb = productoService.crearProducto(productoEntity);


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
    
    @GetMapping(value = "api/producto/generar/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> generarPDF() throws IOException {
        // Fetch data for PDF generation (replace with your logic)
        List<ProductoResponse> productos = productoService.obtenerProductosCantidades();


        if (productos.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Generate PDF using iText API
        ByteArrayOutputStream byteArrayOutputStream = null;
        try {
            String[] nombreColumnas = {"Categoria", "Nombre", "Referencia", "Stock", "Cantidad", "Precio"};

            List<String[]> productoReporteList = new ArrayList<>();

            for (ProductoResponse producto : productos) {
                String[] productoReporte = getProductoReporte(producto);
                productoReporteList.add(productoReporte);
            }

            byteArrayOutputStream = pdfUtil.generarPDF("Productos", productoReporteList, nombreColumnas);
            //byteArrayOutputStream = generatePDF(productos);
        } catch (MalformedURLException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "Productos.pdf");
        InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(byteArrayOutputStream.toByteArray()));

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(byteArrayOutputStream.toByteArray());
    }

    private static String[] getProductoReporte(ProductoResponse producto) {
        return new String[] {
                producto.getNombreCategoria(),
                producto.getNombreProducto(),
                producto.getReferenciaProducto(),
                String.valueOf(producto.getExistencia().getStock()),
                String.valueOf(producto.getExistencia().getCantidad()),
                colombianCurrencyFormat.format(producto.getPrecioProducto())
        };
    }

}


