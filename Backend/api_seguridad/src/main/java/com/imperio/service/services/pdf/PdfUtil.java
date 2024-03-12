package com.imperio.service.services.pdf;

import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.io.source.ByteArrayOutputStream;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.events.PdfDocumentEvent;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfPage;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.Canvas;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.stereotype.Component;

import java.net.MalformedURLException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

import java.util.List;



@Component
public class PdfUtil {
    public ByteArrayOutputStream generarPDF(String titulo, List<String[]> datos, String[] nombreColumnas) throws MalformedURLException {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        PdfDocument pdfDocument = new PdfDocument(new PdfWriter(byteArrayOutputStream));
        Document document = new Document(pdfDocument);
        pdfDocument.setDefaultPageSize(PageSize.A4);

        addHeader(document, titulo);

        addContent(document, datos, nombreColumnas);

        addFooter(pdfDocument);

        document.close();
        return byteArrayOutputStream;
    }

    private void addHeader(Document document, String titulo) throws MalformedURLException {
        // Add header, content, and footer
        Paragraph header = new Paragraph();

// Read logo image (assuming logo.png exists in the project directory)
        String imagePath = "classpath:img/logo.png";
        Image logo = new Image(ImageDataFactory.create(imagePath));
        logo.setWidth(95) // Adjust width as needed
                .setMarginLeft(20)
                .setMarginTop(0)
                .setPaddingTop(0);
        header.add(logo);

        Table headerTable = createHeaderTable();
        header.add(headerTable);

        Paragraph dateAndTime = new Paragraph(String.format("%s \n %s",
                LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"))))
                .setFontSize(10)
                .setMarginLeft(20)
                .setMarginTop(0)
                .setPaddingTop(0);
        header.add(dateAndTime);
        document.add(header);

        //Add tittle
        Paragraph tittle = new Paragraph(titulo)
                .setFontSize(16)
                .setBold()
                .setMarginTop(5)
                .setMarginBottom(5)
                .setTextAlignment(TextAlignment.CENTER);
        document.add(tittle);
    }
    private Table createHeaderTable() {
        Table table = new Table(UnitValue.createPercentArray(new float[]{1, 1}));
        table.setWidth(UnitValue.createPercentValue(60));
        table.setBorder(Border.NO_BORDER);

        // Row 1
        Cell cell11 = new Cell().add(new Paragraph("Discoteca Imperio").setFontSize(12).setBold())
                .setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.CENTER);
        Cell cell12 = new Cell().add(new Paragraph("Reporte Productos").setFontSize(12))
                .setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.CENTER);
        table.addCell(cell11);
        table.addCell(cell12);

        // Row 2
        Cell cell21 = new Cell().add(new Paragraph("Dirección: Cll 49 #28-47").setFontSize(10))
                .setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.CENTER);
        Cell cell22 = new Cell().add(new Paragraph("Celular: 300 4395676").setFontSize(10))
                .setBorder(Border.NO_BORDER)
                .setTextAlignment(TextAlignment.CENTER);
        table.addCell(cell21);
        table.addCell(cell22);

        return table;
    }

    private void addContent(Document document, List<String[]> data, String[] nombreColumnas) {
        Table table = new Table(UnitValue.createPercentArray(getSizeColumns(nombreColumnas))).setMarginTop(20); // Adjust margins as needed
        table.setWidth(UnitValue.createPercentValue(100));

        createHeaderTableContent(table, nombreColumnas);

        createBodyTableContent(table, data, nombreColumnas);

        document.add(table);
    }

    private float[] getSizeColumns(String[] nombreColums) {
        float[] numeroColumnas =  new float[nombreColums.length];
        for (int i = 0; i < nombreColums.length; i++) {
            numeroColumnas[i] = 1;
        }
        return numeroColumnas;
    }

    private void createHeaderTableContent(Table table, String[] nombreColumnas) {
        for(String columna : nombreColumnas) {
            Cell headerCell1 = new Cell()
                    .setBackgroundColor(new DeviceRgb(174, 146, 67))
                    .setFontColor(ColorConstants.WHITE)
                    .setPadding(5)
                    .setMargin(0)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setBorder(Border.NO_BORDER);  // No border
            //.setWidth(UnitValue.createPercentValue(100));  // Full width
            headerCell1.add(new Paragraph(columna));
            table.addHeaderCell(headerCell1);
        }
    }

    private void createBodyTableContent(Table table, List<String[]> data, String[] columnWidths) {
        for (String[] fila : data) {
            for (int i = 0; i < columnWidths.length; i++) {
                Cell cell = new Cell().setPadding(5);

                // Aplicar estilo según la posición en la fila
                if (i == 0) {
                    cell.setBorderLeft(new SolidBorder(new DeviceRgb(181, 179, 179), 0.5f))
                            .setBorderBottom(new SolidBorder(new DeviceRgb(181, 179, 179), 0.5f))
                            .setBorderRight(Border.NO_BORDER)
                            .setBorderTop(Border.NO_BORDER);
                } else if (i == columnWidths.length - 1) {
                    cell.setBorderLeft(Border.NO_BORDER)
                            .setBorderBottom(new SolidBorder(new DeviceRgb(181, 179, 179), 0.5f))
                            .setBorderRight(new SolidBorder(new DeviceRgb(181, 179, 179), 0.5f))
                            .setBorderTop(Border.NO_BORDER);
                } else {
                    cell.setBorderLeft(Border.NO_BORDER)
                            .setBorderBottom(new SolidBorder(new DeviceRgb(181, 179, 179), 0.5f))
                            .setBorderRight(Border.NO_BORDER)
                            .setBorderTop(Border.NO_BORDER);
                }

                cell.add(new Paragraph(fila[i]).setFontSize(10)
                        .setTextAlignment(TextAlignment.RIGHT));

                table.addCell(cell);
            }
        }

    }


    private void addFooter(PdfDocument pdfDocument) {
        // Add footer
        pdfDocument.addEventHandler(PdfDocumentEvent.END_PAGE, event -> {
            PdfDocumentEvent docEvent = (PdfDocumentEvent) event;
            PdfDocument pdfDoc = docEvent.getDocument();
            PdfPage page = docEvent.getPage();
            Rectangle pageSize = page.getPageSize();

            float x = pageSize.getWidth() / 2;
            float y = pageSize.getBottom() + 25;

            PdfCanvas pdfCanvas = new PdfCanvas(page);
            Paragraph footer = new Paragraph()
                    .setTextAlignment(TextAlignment.CENTER)
                    .add(new Text("Página ").setFontSize(10))
                    .add(new Text(String.valueOf(pdfDoc.getPageNumber(page))).setFontSize(10))
                    .add(new Text(" de "))
                    .add(new Text(String.valueOf(pdfDoc.getNumberOfPages())).setFontSize(10));

            Canvas canvas = new Canvas(pdfCanvas, page.getPageSize());
            canvas.showTextAligned(footer, x, y, TextAlignment.CENTER);
            canvas.close();
        });
    }
}
