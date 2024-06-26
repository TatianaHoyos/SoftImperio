﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using venta.Data;
using venta.DTO;
using venta.DTO.Pedido;
using venta.Model;
using venta.Models;
using venta.Repository;
using venta.SignalR;
using Microsoft.AspNetCore.Cors;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using System.Diagnostics;

namespace venta.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class VentasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<MiClaseSignalR> _hubContext;
        private readonly IProductoRepository _productoService;

        private static TraceSource ts = new TraceSource("VentasController");

        public VentasController(ApplicationDbContext context,
            IHubContext<MiClaseSignalR> hubContext,
            IProductoRepository productoService)
        {
            _context = context;
            _hubContext = hubContext;
            _productoService = productoService;

        }
        // GET: api/Ventas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Venta>>> Getcreditos()
        {
            if (_context.Venta == null)
            {
                return NotFound();
            }
            return await _context.Venta.ToListAsync();
        }

        // GET: api/Ventas/ByFecha
        [HttpGet("ByFecha")]
        public async Task<ActionResult<IEnumerable<Venta>>> GetVentasPorFecha(DateTime? fechaInicio = null, DateTime? fechaFin = null)
        {
            try
            {
                IQueryable<Venta> query = _context.Venta;

                if (fechaInicio.HasValue && fechaFin.HasValue)
                {
                    // Aplica el filtro por fechas solo si ambas fechas están presentes
                    query = query.Where(venta => venta.fechaVenta >= fechaInicio.Value && venta.fechaVenta <= fechaFin.Value);
                }

                var ventas = await query.ToListAsync();
                return Ok(ventas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }




        // GET: api/Ventas
        [HttpGet("ventas-ultimo-mes")]
        public ActionResult<IEnumerable<VentasPorMesDTO>> ObtenerVentasUltimoMes()
        {
            try
            {
                var fechaInicio = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                var fechaFin = fechaInicio.AddMonths(1);

                var ventasUltimoMes = _context.Venta
                    .Where(v => v.fechaVenta >= fechaInicio && v.fechaVenta < fechaFin)
                    .GroupBy(v => new { v.fechaVenta.Year, v.fechaVenta.Month })
                    .Select(g => new VentasPorMesDTO
                    {
                        Año = g.Key.Year,
                        Mes = g.Key.Month,
                        TotalVenta = g.Sum(v => v.totalVenta)
                    })
                    .ToList();

                return Ok(ventasUltimoMes);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al obtener las ventas del último mes");
            }
        }


        [HttpGet("ventas-por-mes")]
        public ActionResult<IEnumerable<VentasPorMesDTO>> ObtenerVentasPorMes()
        {
            try
            {
                // Obtener fecha de hace un año
                var fechaInicio = DateTime.Now.AddMonths(-12);

                var ventasPorMes = _context.Venta
                    .Where(v => v.fechaVenta >= fechaInicio && v.fechaVenta <= DateTime.Now)
                    .GroupBy(v => new { v.fechaVenta.Year, v.fechaVenta.Month })
                    .Select(g => new VentasPorMesDTO
                    {
                        Año = g.Key.Year,
                        Mes = g.Key.Month,
                        TotalVenta = g.Sum(v => v.totalVenta)
                    })
                    .OrderBy(g => g.Año)
                    .ThenBy(g => g.Mes)
                    .ToList();

                return Ok(ventasPorMes);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al obtener las ventas por mes");
            }
        }



        //GET: api/Ventas/GenerarPDF
        [HttpGet("GenerarPDF")]
        public async Task<IActionResult> GenerarPDF()
        {
            List<Venta> ventas = await _context.Venta.ToListAsync();

            if (ventas == null || ventas.Count == 0)
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
                            //var rutaImagen = Path.Combine(_webHostEnvironment.WebRootPath, "img/logo.png");
                            //byte[] imagenData = System.IO.File.ReadAllBytes(rutaImagen);
                            // Agregar el logo al encabezado
                            //row.ConstantItem(95).Background(Colors.White).Image(imagenData);
                            row.RelativeItem()
                            .Column(col =>
                            {
                                col.Item().AlignCenter().Text("Discoteca Imperio").Bold().FontSize(12);
                                col.Item().AlignCenter().Text("Dirección: Cll 49 #28-47").FontSize(10);
                            });
                            row.RelativeItem()
                            .Column(col =>
                            {
                                col.Item().AlignCenter().Text("Reporte Ventas").FontSize(16);
                                col.Item().AlignCenter().Text("Celular: 300 4395676").FontSize(10);
                            });
                            row.RelativeItem()
                            .Column(col =>
                            {
                                col.Item().AlignCenter().Text(DateTime.Now.ToString("dd/MM/yyyy")).FontSize(10);
                                col.Item().AlignCenter().Text(DateTime.Now.ToString("HH:mm:ss")).FontSize(10);
                            });
                        });
                        page.Content().PaddingVertical(10).Column(col1 =>
                        {
                            col1.Item().AlignCenter().Text("Ventas").Bold().FontSize(16);
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
                                foreach (var venta in ventas)
                                {
                                    tabla.Cell().BorderLeft(0.5f).BorderColor("#b5b3b3")
                                         .BorderBottom(0.5f).BorderColor("#b5b3b3")
                                         .Padding(2).AlignCenter().Text(venta.fechaVenta).FontSize(10);
                                    tabla.Cell().BorderRight(0.5f).BorderColor("#b5b3b3")
                                         .BorderBottom(0.5f).BorderColor("#b5b3b3")
                                         .Padding(2).AlignCenter().Text($"${venta.totalVenta}").FontSize(10);
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
                return File(stream, "aplication/pdf", "Ventas.pdf");
            }


        }


        // GET: api/Ventas
        [HttpGet]
        [Route("Pendientes")]
        public async Task<ActionResult<IEnumerable<Venta>>> GetVentasPendientes()
        {
            if (_context.Venta == null)
            {
                return NotFound();
            }
            return await ConsultarVentasPendientes();
;
        }


        //para hacer la consulta de el pedido
        [HttpGet("{id}")]
        [Produces("application/json")]
        public async Task<ActionResult<IEnumerable<VentaDetalleResponseDto>>> ObtenerDetalleVenta(int id)
        {
            var ventaExistente = await _context.Venta.AnyAsync(v => v.idVenta == id);

            if (!ventaExistente)
            {
                return NotFound($"No se encontró la venta con ID {id}");
            }

            var resultado = await _context.Venta
                .Where(v => v.idVenta == id)
                .Join(_context.DetalleVenta, v => v.idVenta, dv => dv.IdVenta, (v, dv) => new { v, dv })
                .Join(_context.Existencia, vd => vd.dv.IdExistencias, e => e.IdExistencias, (vd, e) => new { vd, e })
                .Join(_context.Productos, vde => vde.e.IdProductos, p => p.IdProductos, (vde, p) => new VentaDetalleResponseDto
                {
                    NombreProducto = p.NombreProducto,
                    ReferenciaProducto = p.ReferenciaProducto,
                    SubTotalAPagar = vde.vd.dv.SubTotalAPagar,
                    IdProductos = p.IdProductos,
                    CantidadProducto = vde.vd.dv.CantidadProducto,
                    TotalVenta = vde.vd.v.totalVenta
                })
                .ToListAsync();

            return Ok(resultado);
        }

      

        // POST: api/Ventas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Route("Mesa")]
        public async Task<ActionResult<Pedido>> PostVentaMesa(Pedido pedidoRequest)
        {
            if (_context.DetalleVenta == null)
            {
                return NotFound();
            }
            var response = await ProcesarPedido(pedidoRequest, "pendiente", "Mesa");
            if (response.status == "Error")
            {
                return StatusCode(424, new JsonResult(response));
            }

            NotificarBarra();

           
            
            return new JsonResult(response);
          
        }
        
        [HttpPost]
        [Route("Barra")]
        public async Task<ActionResult<Pedido>> PostVentaBarra(Pedido pedidoRequest)
        {

            var response = await ProcesarPedido(pedidoRequest, "vendido", "Barra");
            if (response.status == "Error")
            {

                return StatusCode(424, new JsonResult(response));
            }
            return new JsonResult(response);
        }

        [HttpPost]
        [Route("Barra/{idVenta}")]
        public async Task<ActionResult<Pedido>> PostVentaNotificacion(int idVenta, [FromBody] ConfirmarPedidoRequestDto pedidoRequest)
        {
            Response response = new Response();
            try {
                if (idVenta != pedidoRequest.idPedido)
                {

                    response.status = "Error";
                    response.message = "Los IDs proporcionados no coinciden.";
                    return BadRequest(response);

                }
                //se guarda la info que consulto de la db.
                var ventaExistente = await _context.Venta.FindAsync(idVenta);

                if (ventaExistente == null)
                {

                    response.status = "Error";
                    response.message = $"No se encontró la venta con ID {idVenta}";
                    return StatusCode(404, new JsonResult(response));

                }
                if (ventaExistente.estado == "pendiente")
                {
                    ventaExistente.estado = "vendido";
                }
                //agrego a la base de datos el estado de la venta
                _context.Venta.Update(ventaExistente);
                await _context.SaveChangesAsync();
                response = new Response
                {
                    message = $"Se pudo completar la venta con éxito: {ventaExistente.totalVenta}",
                    status = "Exito"
                };
                return Ok(response);

            }
            catch (Exception e){
                response.status = "Error";
                response.message = "ocurrio un error inesperado";
                return StatusCode(500, new JsonResult(response));
            }


        }

        private async Task<Response> ProcesarPedido(Pedido pedidoRequest, string estadoVenta, string origenVenta)
        {
            Response response = new Response();
            var pedidos = AgruparPedidos(pedidoRequest);

            try
            {
                var (detalleDeVentaAguardar, existenciasActualizar, totalP) = RealizarValidaciones(pedidos);

                await using (var transaction = await _context.Database.BeginTransactionAsync().ConfigureAwait(false))
                {
                try
                {
                    var venta = await GuardarVenta(estadoVenta, origenVenta, totalP);

                    AsignarIdVenta(detalleDeVentaAguardar, venta.idVenta);

                    await GuardarDetallesVenta(detalleDeVentaAguardar);

                    await ActualizarExistencias(existenciasActualizar);

                        await _context.SaveChangesAsync().ConfigureAwait(false); // Guarda los cambios de manera asincrónica

                        await transaction.CommitAsync().ConfigureAwait(false); // Commit de la transacción
                    }
                catch (Exception ex) //Capturamos error de guardado o actualización en la db
                {
                    Console.WriteLine($"Error: {ex.Message}");
                        await transaction.RollbackAsync().ConfigureAwait(false);
                        response = new Response { message = "No se pudo completar la venta", status = "Error" };
                    return response;
                }

                response = new Response { message = $"Se pudo completar la venta con éxito: {totalP}", status = "Exito" };
                return response;
            }
        
            }
            catch (Exception e) //Capturamos errores lanzados del metodo RealizarValidaciones()
            {
                response = new Response { message = e.Message, status = "Error" };
                return response;
            }
        }

        // garantizo que no hayan id repetidos
        private List<DetallePedido> AgruparPedidos(Pedido pedidoRequest)
        {
            return pedidoRequest.pedido
                .GroupBy(detalle => detalle.idProducto)
                .Select(grupo => new DetallePedido
                {
                    idProducto = grupo.Key,
                    cantidad = grupo.Sum(detalle => detalle.cantidad)
                })
                .ToList();
        }

        private (List<DetalleVenta>, List<Existencia>, float) RealizarValidaciones(List<DetallePedido> pedidos)
        {
            var detalleDeVentaAguardar = new List<DetalleVenta>();
            var existenciasActualizar = new List<Existencia>();
            var totalP = 0f;

            List<int> listaDeId = pedidos.Select(detalle => detalle.idProducto).ToList();

            //consulto de la db la tabla de existencia  
            var existencias = _productoService.ObtenerExitencia(listaDeId);
            //consulto de la db todos los productos del pedido con el id
            var productos = _productoService.ObtenerProductos(listaDeId);

            foreach (var pedido in pedidos)
            {
                // Verificar que el id del pedido sea el mismo id de productos y existencias
                var producto = productos.FirstOrDefault(p => p.IdProductos == pedido.idProducto);
                var existencia = existencias.FirstOrDefault(e => e.IdProductos == pedido.idProducto);

                if (producto != null && existencia != null)
                {
                    // Verificar que la cantidad disponible sea suficiente
                    if (existencia.Cantidad >= pedido.cantidad)
                    {
                        // Realizar el pedido: restar la cantidad de existencias y
                        // realizar otras acciones necesarias

                        //se suma el total de la venta
                        var precioProducto = (producto.PrecioProducto * pedido.cantidad);
                        totalP += precioProducto;

                        existencia.Cantidad -= pedido.cantidad;
                        existenciasActualizar.Add(existencia);

                        //le asigno los valores a detalle venta para guardarlos en la tabla
                        DetalleVenta detalleDeVenta = new DetalleVenta();
                        detalleDeVenta.IdExistencias = existencia.IdExistencias;
                        detalleDeVenta.CantidadProducto = pedido.cantidad;
                        detalleDeVenta.SubTotalAPagar = precioProducto;
                        detalleDeVentaAguardar.Add(detalleDeVenta);


                        Console.WriteLine($"El pedido se puede procesar por que existe y hay cantidad suficiente");
                    }
                    else
                    {
                        Console.WriteLine($"No hay suficientes existencias para el producto " +
                            $"{producto.NombreProducto} para satisfacer el pedido. " +
                            $"Cantidad disponible: {existencia.Cantidad}");
                        /*response = new Response
                        {
                            message = "El pedido no se puede procesar con exito, la existencia no es suficiente",
                            status = "Error"
                        };*/
                        throw new Exception("No hay suficientes existencias para completar el pedido.");
                    }
                }
                else
                {
                    Console.WriteLine($"No se encontró el producto con id {pedido.idProducto} " +
                        $"o las existencias correspondientes para el pedido");
                    /*response = new Response
                    {
                        message = "El producto no exite",
                        status = "Error"
                    };*/
                    throw new Exception("No se encontró el producto o las existencias correspondientes.");
                }
            }
           

            return (detalleDeVentaAguardar, existenciasActualizar, totalP);
        }

        private async Task<Venta> GuardarVenta(string estado, string origen, float totalP)
        {
            var venta = new Venta { totalVenta = totalP, estado = estado, origen = origen };
            _context.Venta.Add(venta);
            await _context.SaveChangesAsync();
            return venta;
        }

        private void AsignarIdVenta(List<DetalleVenta> detalleDeVentaAguardar, int idVenta)
        {
            foreach (var detalle in detalleDeVentaAguardar)
            {
                detalle.IdVenta = idVenta;
            }
        }

        private async Task GuardarDetallesVenta(List<DetalleVenta> detalleDeVentaAguardar)
        {
            _context.DetalleVenta.AddRange(detalleDeVentaAguardar);
            await _context.SaveChangesAsync();
        }

        private async Task ActualizarExistencias(List<Existencia> existenciasActualizar)
        {
            _context.Existencia.UpdateRange(existenciasActualizar);
            await _context.SaveChangesAsync();
        }

        private async Task NotificarBarra()
        {
            try
            {
                List<Venta> ventasPendientes = await ConsultarVentasPendientes();
                // Convertir la lista a una cadena JSON
                string jsonString = JsonConvert.SerializeObject(ventasPendientes);
                // Notificar a la barra los pedidos en estado pendiente que hay en ventas a través de SignalR
                _hubContext.Clients.All.SendAsync("ReceiveMessage", jsonString, "Usuario");
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al notificar a la barra:");
                Console.WriteLine(e.Message); // Imprime el mensaje de la excepción
                Console.WriteLine(e.StackTrace); // Imprime la pila de llamadas de la excepción
            }
            
        }
        private async Task<List<Venta>> ConsultarVentasPendientes()
        {
            string estadoPendiente = "pendiente";

            // Filtra las ventas por el estado pendiente
            var ventas = await _context.Venta
                .Where(v => v.estado.Equals(estadoPendiente))
                .ToListAsync();

            return ventas;
        }


    }

}
