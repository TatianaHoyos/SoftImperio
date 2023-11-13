using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using venta.Data;
using venta.DTO;
using venta.DTO.Pedido;
using venta.Model;
using venta.Models;
using venta.Repository;
using venta.SignalR;

namespace venta.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class VentasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<MiClaseSignalR> _hubContext;
        private readonly IProductoRepository _productoService;

        public VentasController(ApplicationDbContext context,
            IHubContext<MiClaseSignalR> hubContext,
            IProductoRepository productoService)
        {
            _context = context;
            _hubContext = hubContext;
            _productoService = productoService;

        }

        // GET: api/Ventas/ByFecha
        [HttpGet("ByFecha")]
        public async Task<ActionResult<IEnumerable<Venta>>> GetVentasPorFecha(DateTime fechaInicio, DateTime fechaFin)
        {
            if (_context.Venta == null)
            {
                return NotFound();
            }

            var ventas = await _context.Venta
                .Where(venta => venta.fechaVenta >= fechaInicio && venta.fechaVenta <= fechaFin)
                .ToListAsync();

            return ventas;

        }
        // GET: api/Ventas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Venta>>> GetVentas()
        {
            if (_context.Venta == null)
            {
                return NotFound();
            }
            return await _context.Venta.ToListAsync();
        }

        // GET: api/Ventas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Venta>> GetVenta(int id)
        {
            if (_context.Venta == null)
            {
                return NotFound();
            }
            var venta = await _context.Venta.FindAsync(id);

            if (venta == null)
            {
                return NotFound();
            }

            return venta;
        }

        // PUT: api/Ventas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVenta(int id, Venta venta)
        {
            if (id != venta.idVenta)
            {
                return BadRequest();
            }

            _context.Entry(venta).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VentaExists(id))
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

        // POST: api/Ventas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Venta>> PostVenta(Venta venta)
        {
            if (_context.Venta == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Ventas'  is null.");
            }
            _context.Venta.Add(venta);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVenta", new { id = venta.idVenta }, venta);
        }

        // DELETE: api/Ventas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVenta(int id)
        {
            if (_context.Venta == null)
            {
                return NotFound();
            }
            var venta = await _context.Venta.FindAsync(id);
            if (venta == null)
            {
                return NotFound();
            }

            _context.Venta.Remove(venta);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VentaExists(int id)
        {
            return (_context.Venta?.Any(e => e.idVenta == id)).GetValueOrDefault();
        }

        // POST: api/Ventas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Route("Mesa")]
        public async Task<ActionResult<Pedido>> PostVentaMesa(Pedido pedido)
        {
            if (_context.DetalleVenta == null)
            {
                return NotFound();
            }
            //_context.PuntoDeVentaEnMesa.Add(venta);
            //await _context.SaveChangesAsync();

            var response = new Response
            {
                message = "El pedido de mesa se agrego correctamente",
                status = "Success"
            };

            // Notificar a los clientes a través de SignalR
            _hubContext.Clients.All.SendAsync("ReceiveMessage", "id del pedido " + pedido.pedido[0].idProducto
                + " - cantidad " + pedido.pedido[0].cantidad, "Usuario");

            // Serializar la instancia en formato JSON y retornarla como JsonResult
            return new JsonResult(response);
        }
        [HttpPost]
        [Route("Barra")]
        public async Task<ActionResult<Pedido>> PostVentaBarra(Pedido pedidoRequest)
        {
            Response response = new Response();
            if (_context.DetalleVenta == null)
            {
                return NotFound();
            }
            // garantizo que no hayan id repetidos
            var pedidos = pedidoRequest.pedido
            .GroupBy(detalle => detalle.idProducto)
            .Select(grupo => new DetallePedido
            {
                idProducto = grupo.Key,
                cantidad = grupo.Sum(detalle => detalle.cantidad)
            })
            .ToList();

            List<DetalleVenta> detalleDeVentaAguardar = new List<DetalleVenta>();
            List<Existencia> existenciasActualizar = new List<Existencia>();


            List<int> listaDeId = pedidos.Select(detalle => detalle.idProducto).ToList();
            //consulto de la db la tabla de existencia  
            var existencias = _productoService.ObtenerExitencia(listaDeId);

            //consulto de la db todos los productos del pedido con el id
            var productos = _productoService.ObtenerProductos(listaDeId);
            var totalP = 0f;

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
                        response = new Response
                        {
                            message = "El pedido no se puede procesar con exito, la existencia no es suficiente",
                            status = "Error"
                        };
                        break;
                    }
                }
                else
                {
                    Console.WriteLine($"No se encontró el producto con id {pedido.idProducto} " +
                        $"o las existencias correspondientes para el pedido");
                    response = new Response
                    {
                        message = "El producto no exite",
                        status = "Error"
                    };
                }
            }
            if (response.status != null)
            {
                return StatusCode(424, new JsonResult(response));
            }


            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var valorTotal = totalP;
                    //voy a guardar en la tabla venta
                    Venta venta = new Venta();
                    venta.totalVenta = valorTotal;
                    venta.estado = "vendido";
                    venta.origen = "Barra";

                    _context.Venta.Add(venta);
                    await _context.SaveChangesAsync();

                    //obtengo el id de la venta guardada
                    //venta.idVenta;

                    //recorro el detalleventaguardar para asignarle el id venta que hacia falta
                    foreach (var Detalle in detalleDeVentaAguardar)
                    {
                        Detalle.IdVenta = venta.idVenta;
                    }


                    // Guardar los detalles de venta
                    _context.DetalleVenta.AddRange(detalleDeVentaAguardar);
                    await _context.SaveChangesAsync();

                    //Actualizamos la tabla, refrescando las existencias
                    _context.Existencia.UpdateRange(existenciasActualizar);
                    await _context.SaveChangesAsync();

                    // Commit de la transacción si todo fue exitoso
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    // Algo salió mal, realiza un rollback de la transacción
                    Console.WriteLine($"Error: {ex.Message}");
                    transaction.Rollback();

                    response = new Response
                    {
                        message = "No se pudo completar la venta",
                        status = "Error"
                    };
                    return StatusCode(424, new JsonResult(response));
                }

                response = new Response
                {
                    message = "Se pudo completar la venta con exito " + totalP,
                    status = "Exito"
                };
                return new JsonResult(response);
            }
        }
    }

}
