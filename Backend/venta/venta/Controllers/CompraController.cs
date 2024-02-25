﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using venta.Data;
using venta.DTO;
using venta.Model;
using Microsoft.AspNetCore.Hosting;

namespace venta.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompraController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public CompraController(ApplicationDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        // GET: api/Compra
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Compra>>> GetCompras()
        {
            if (_context.Compras == null)
            {
                return NotFound();
            }
            return await _context.Compras.ToListAsync();
        }

        // GET: api/Compra/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Compra>> GetCompra(int id)
        {
            if (_context.Compras == null)
            {
                return NotFound();
            }
            if (id == 1090208030)
            {
                Console.WriteLine("if last");
                var compra = await _context.Compras
                .OrderBy(x => x.IdCompra)
              .LastOrDefaultAsync();

                if (compra == null)
                {
                    // If there is no element, return a default object with IdCompra equal to 0
                    return new Compra { IdCompra = 0 };
                }

                return compra;
            }
            else
            {
                var compra = await _context.Compras.FindAsync(id);

                if (compra == null)
                {
                    return NotFound();
                }

                return compra;
            }

        }



        // PUT: api/Compra/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCompra(int id, Compra compra)
        {
            if (id != compra.IdCompra)
            {
                return BadRequest();
            }

            _context.Entry(compra).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CompraExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Compra
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Compra>> PostCompra(Compra compra)
        {
            if (_context.Compras == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Compras'  is null.");
            }
            _context.Compras.Add(compra);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCompra", new { id = compra.IdCompra }, compra);
        }

        // DELETE: api/Compra/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCompra(int id)
        {
            if (_context.Compras == null)
            {
                return NotFound();
            }
            var compra = await _context.Compras.FindAsync(id);
            if (compra == null)
            {
                return NotFound();
            }
            //consulta detalles asociados a la compra
            Console.WriteLine("------------------------------" + id);

            //validar fecha de compra
            bool isCompraIsNotEditable = validarFechaCompra(compra.FechaCompra);

            if (isCompraIsNotEditable)
            {
                return BadRequest("No puedes editar o eliminar una compra después de 24 horas.");

            }
            else
            {

                var detallesCompra = _context.DetalleCompra
               .Where(dc => dc.IdCompra == id)
               .ToList();

                //Eliminar cada detalle de compra encontrado
                foreach (var detalleCompra in detallesCompra)
                {
                    _context.DetalleCompra.Remove(detalleCompra);

                }
                await _context.SaveChangesAsync();

                _context.Compras.Remove(compra);
                await _context.SaveChangesAsync();

                return NoContent();
            }
        }

        private bool validarFechaCompra(DateTime? fechaCompra)
        {
            throw new NotImplementedException();
        }

        private bool CompraExists(int id)
        {
            return (_context.Compras?.Any(e => e.IdCompra == id)).GetValueOrDefault();
        }

        private bool validarFechaCompra(DateTime fechaCompra)
        {
            // Agregar la validación de tiempo aquí
            var tiempoLimiteEliminar = TimeSpan.FromHours(24);
            var tiempoTranscurridoEliminar = DateTime.Now - fechaCompra;

            return tiempoTranscurridoEliminar > tiempoLimiteEliminar;

        }

        //GET: api/Compra/GenerarPDF
        [HttpGet("GenerarPDF")]
        public async Task<IActionResult> GenerarPDF()
        {
            List<Compra> compras = await _context.Compras.ToListAsync();

            if (compras == null || compras.Count == 0)
            {
                return NotFound("No hay datos para generar el PDF");
            }
            else
            {
                var pdf = Document.Create(document =>
                {
                    document.Page(page =>
                    {
                        page.Margin(30);
                        page.Header().ShowOnce().Row(row =>
                        {
                            Console.WriteLine("linea --------- "+ _webHostEnvironment.WebRootPath);
                            var rutaImagen = Path.Combine(_webHostEnvironment.WebRootPath, "img/logo.png");
                            byte[] imagenData = System.IO.File.ReadAllBytes(rutaImagen);

                            // Agregar el logo al encabezado
                            row.ConstantItem(95).Image(imagenData);


                            row.RelativeItem()
                            .Column(col =>
                            {
                                col.Item().AlignCenter().Text("Imperio").Bold().FontSize(14);
                                col.Item().AlignCenter().Text("Cll 49 #28-47").FontSize(10);                           
                            });

                            row.RelativeItem().Column(col =>
                            {
                                col.Item().AlignCenter().Text(DateTime.Now.ToString("dd/MM/yyyy")).FontSize(10);
                                col.Item().AlignCenter().Text(DateTime.Now.ToString("HH:mm:ss")).FontSize(10);
                            });
                        });
                        

                        page.Content().PaddingVertical(15).Column(col1 =>
                        {
                            col1.Item().AlignCenter().Text("Compras").Bold().FontSize(16);

                            col1.Item().PaddingVertical(15).Table(tabla =>
                            {
                                tabla.ColumnsDefinition(columns =>
                                {
                                    columns.RelativeColumn();
                                    columns.RelativeColumn();
                                   
                                });

                                tabla.Header(header =>
                                {
                                    header.Cell().Background("#ae9243").BorderLeft(0.5f).BorderColor("#ae9243").
                                    Padding(2).AlignCenter().Text("Fecha").Bold().FontColor("#ffffff");
                                    header.Cell().Background("#ae9243").BorderLeft(0.5f).BorderColor("#ae9243").
                                    Padding(2).AlignCenter().Text("Total").Bold().FontColor("#ffffff");
                                    
                                });

                                foreach (var compra in compras)
                                {
                                    tabla.Cell().BorderLeft(0.5f).BorderColor("#b5b3b3")
                                         .BorderBottom(0.5f).BorderColor("#b5b3b3")
                                         .Padding(2).AlignCenter().Text(compra.FechaCompra).FontSize(10);

                                    tabla.Cell().BorderRight(0.5f).BorderColor("#b5b3b3")
                                         .BorderBottom(0.5f).BorderColor("#b5b3b3")
                                         .Padding(2).AlignCenter().Text($"${ compra.TotalCompra}").FontSize(10);

                                }
                            });
                        });

                        page.Footer().Height(50)
                        .AlignCenter()
                        .Text(txt =>
                        {
                            txt.Span("Página ").FontSize(10);
                            txt.CurrentPageNumber().FontSize(10);
                            txt.Span(" de ").FontSize(10);
                            txt.TotalPages().FontSize(10);
                        });
                    });
                })
                   .GeneratePdf();

                Stream stream = new MemoryStream(pdf);
                return File(stream, "aplication/pdf", "Compras.pdf");
            }

        }
    }

}