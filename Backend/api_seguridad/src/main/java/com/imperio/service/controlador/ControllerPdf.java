package com.imperio.service.controlador;

import com.imperio.service.model.dto.producto.ProductoResponse;
import com.imperio.service.model.entity.ComprasEntity;
import com.imperio.service.model.entity.VentaEntity;
import com.imperio.service.repository.CompraService;
import com.imperio.service.repository.ProductoService;
import com.imperio.service.repository.VentaService;
import com.imperio.service.services.pdf.PdfUtil;
import com.itextpdf.io.exceptions.IOException;
import com.itextpdf.io.source.ByteArrayOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class ControllerPdf {
    @Autowired
    private PdfUtil pdfUtil;
    @Autowired
    private CompraService comprasService;
    @Autowired
    private VentaService ventaService;

    @GetMapping(value = "api/compras/generar/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> generarPDF() throws IOException {
        // Fetch data for PDF generation (replace with your logic)
        List<ComprasEntity> compras = comprasService.obtenerCompras();


        if (compras.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Generate PDF using iText API
        ByteArrayOutputStream byteArrayOutputStream = null;
        try {
            String[] nombreColumnas = {"Fecha ", "Total"};

            List<String[]> productoReporteList = new ArrayList<>();

            for (ComprasEntity compra : compras) {
                String[] productoReporte = getCompraReporte(compra);
                productoReporteList.add(productoReporte);
            }

            byteArrayOutputStream = pdfUtil.generarPDF("Compras", productoReporteList, nombreColumnas);
            //byteArrayOutputStream = generatePDF(productos);
        } catch (MalformedURLException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "Compras.pdf");
        InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(byteArrayOutputStream.toByteArray()));

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(byteArrayOutputStream.toByteArray());
    }
    private static String[] getCompraReporte(ComprasEntity compra) {
        return new String[] {
                compra.getFechaCompra().toString(),
              Double.toString(compra.getTotalCompra())
        };
    }

    @GetMapping(value = "api/ventas/generar/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> generarVentaPDF() throws IOException {
        // Fetch data for PDF generation (replace with your logic)
        List<VentaEntity> ventas = ventaService.obtenerVentas();


        if (ventas.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Generate PDF using iText API
        ByteArrayOutputStream byteArrayOutputStream = null;
        try {
            String[] nombreColumnas = {"Fecha ", "Total","Origen"};

            List<String[]> productoReporteList = new ArrayList<>();

            for (VentaEntity venta : ventas) {
                String[] productoReporte = getVentaReporte(venta);
                productoReporteList.add(productoReporte);
            }

            byteArrayOutputStream = pdfUtil.generarPDF("Ventas", productoReporteList, nombreColumnas);
            //byteArrayOutputStream = generatePDF(productos);
        } catch (MalformedURLException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "Ventas.pdf");
        InputStreamResource resource = new InputStreamResource(new ByteArrayInputStream(byteArrayOutputStream.toByteArray()));

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(byteArrayOutputStream.toByteArray());
    }
    private static String[] getVentaReporte(VentaEntity venta) {
        return new String[] {
                venta.getFechaVenta(),
                Double.toString(venta.getTotalVenta()),
                venta.getOrigen()
        };
    }
}
