using venta.Data;
using venta.Dto;
using venta.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using venta.Controllers;

namespace Compras_SoftImperio.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ComprasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        private readonly ILogger<ComprasController> _logger;

        public ComprasController(ILogger<ComprasController> logger, ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet("list",Name = "GetCompras")]
        public async Task<ActionResult<IEnumerable<Compra>>> GetCompras()
        {
            try
            {
                var compras = await _context.Compra
                    .ToListAsync();
                Console.WriteLine("list compras ->" + compras.ToList());
                return Ok(compras);
            }catch (Exception ex)
            {
                var errorResponse = new ErrorResponse
                {
                    ErrorCode = "500",
                    ErrorMessage = "Ocurrió un error al ejecutar la operación"
                };

                return BadRequest(errorResponse);
            }

        }


        [HttpPost("add", Name = "CreateCompra")]
        public async Task<IActionResult> CreateCompra([FromBody] CompraInputDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Create a Compra object from the input model
            var compra = new Compra
            {
                IdCompra = 0,
                FechaCompra = model.FechaCompra,
                TotalCompra = model.TotalCompra
            };

            // Add the Compra to the context and save changes
            try { 
            _context.Compra.Add(compra);
            await _context.SaveChangesAsync();

                // Return a response indicating success
                return Ok(compra);
            }
            catch (Exception ex)
            {
                var errorResponse = new ErrorResponse
                {
                    ErrorCode = "500",
                    ErrorMessage = "Ocurrió un error al ejecutar la operación"
                };

                return BadRequest(errorResponse);
            }
         
        }


        [HttpGet("listProducts", Name = "GetExistenciaProducto")]
        public async Task<ActionResult<IEnumerable<ExistenciaProductoDto>>> GetExistenciaProducto()
        {
            try
            {
                List<ExistenciaProductoDto> productoDtos = new List<ExistenciaProductoDto>();
                var existencias = await _context.Existencia
                    .ToListAsync();
                var productos = _context.Productos.ToList();

                foreach (var existencia in existencias)
                {
                   var producto = productos.Find(p=>p.IdProductos == existencia.IdProductos);
                    if (producto != null) {
                        productoDtos.Add(new ExistenciaProductoDto
                        {
                            IdProducto=producto.IdProductos ,
                            NombreProducto= producto.NombreProducto,
                            FotoProducto= producto.FotoProducto,
                            ReferenciaProducto= producto.ReferenciaProducto,
                            IdExistencia = existencia.IdExistencias,
                            Stock= existencia.Stock
                        });
                    }
                   
                }
                Console.WriteLine("list productos ->" + productos.Count);
                return Ok(productoDtos);
            }
            catch (Exception ex)
            {
                var errorResponse = new ErrorResponse
                {
                    ErrorCode = "500",
                    ErrorMessage = "Ocurrió un error al ejecutar la operación"
                };

                return BadRequest(errorResponse);
            }

        }

        [HttpPost("addOrEditDetail", Name = "AgregarDetalleCompra")]
        public async Task<IActionResult> AgregarDetalleCompra([FromBody] DetalleCompraInputDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
          
            try
            {
                DetalleCompra detailCompraResponse;
                if (model.accion.ToLower() == "add")
                {
                    //int lastDetailCompraId = _context.DetalleCompra.ToList().LastOrDefault().IdDetalleCompra;
                    int lastDetailCompraId = _context.DetalleCompra.Any() ? _context.DetalleCompra.Max(dc => dc.IdDetalleCompra) : 0;

                    // Create a DetalleCompra object from the input model
                    var detalleCompra = new DetalleCompra
                    {
                        IdDetalleCompra = lastDetailCompraId + 1,
                        IdCompra = model.IdCompra,
                        IdExistencias = model.IdExistencias,
                        CantidadProductos = model.CantidadProductos,
                        SubTotalCompra = model.CantidadProductos * model.Precio
                    };

                    //crear nuevo registro detalleCompra
                    _context.DetalleCompra.Add(detalleCompra);
                    await _context.SaveChangesAsync();
                    detailCompraResponse = detalleCompra;

                    //suma la cantidad de compra a detalleCompra producto
                    Existencia existenciaUpdated = _context.Existencia.SingleOrDefault(e => e.IdExistencias == detalleCompra.IdExistencias);
                    existenciaUpdated.Cantidad = existenciaUpdated.Cantidad + model.CantidadProductos;
                    _context.Existencia.Update(existenciaUpdated);
                    await _context.SaveChangesAsync();
                }
                else if (model.accion.ToLower() == "edit" && model.IdDetalleCompra != null)
                {
                    var foundDcompra = _context.DetalleCompra.SingleOrDefault(dc => dc.IdDetalleCompra == model.IdDetalleCompra);
                    var oldCantidadDetalleCompra = foundDcompra.CantidadProductos;
                    foundDcompra.CantidadProductos = model.CantidadProductos;
                    foundDcompra.SubTotalCompra = model.CantidadProductos * model.Precio;
                    foundDcompra.IdExistencias = model.IdExistencias;

                    //crear nuevo registro detalleCompra
                    _context.DetalleCompra.Update(foundDcompra);
                    await _context.SaveChangesAsync();
                    detailCompraResponse = foundDcompra;

                    //suma la cantidad de compra a detalleCompra producto
                    Existencia existenciaUpdated = _context.Existencia.SingleOrDefault(e => e.IdExistencias == foundDcompra.IdExistencias);
                    existenciaUpdated.Cantidad = existenciaUpdated.Cantidad + (model.CantidadProductos - oldCantidadDetalleCompra);
                    _context.Existencia.Update(existenciaUpdated);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    return BadRequest(ModelState);
                }
               

                //consultar los registros de detalleCompra asociados a la compra
                var listDetalleCompra = _context.DetalleCompra.ToList()
                    .Where(dc => dc.IdCompra == model.IdCompra);

                //Actualizar el registro de compra en bd, total de compra acorde a los detalles
                double totalCompra = 0;
                foreach (var item in listDetalleCompra)
                {
                    totalCompra = totalCompra + item.SubTotalCompra;
                }
                var compra= _context.Compra.SingleOrDefault(c=>c.IdCompra==model.IdCompra);
                compra.TotalCompra = totalCompra;
                _context.Compra.Update(compra);
                await _context.SaveChangesAsync();

                // Return a response indicating success
                return Ok(detailCompraResponse);
            }
            catch (Exception ex)
            {
                var errorResponse = new ErrorResponse
                {
                    ErrorCode = "500",
                    ErrorMessage = "Ocurrió un error al ejecutar la operación"
                };

                return BadRequest(errorResponse);
            }

        }

        [HttpPost("delete", Name = "DeleteCompra")]
        public async Task<IActionResult> DeleteCompra([FromBody] DeleteByIdInputDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var compra = await _context.Compra.FindAsync(model.id);
                if (compra == null)
                {
                    return NotFound();
                }

                _context.Compra.Remove(compra);
                await _context.SaveChangesAsync();
                //eliminar registros detalleCompra asociados a compraId

                return Ok(compra);
            }
            catch (Exception ex)
            {
                var errorResponse = new ErrorResponse
                {
                    ErrorCode = "500",
                    ErrorMessage = "Ocurrió un error al ejecutar la operación"
                };

                return BadRequest(errorResponse);
            }

        }

        //eliminar detalle compras
        [HttpPost("deleteDetail", Name = "DeleteDetalleCompra")]
        public async Task<IActionResult> DeleteDetalleCompra([FromBody] DeleteDetalleByIdInputDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var detalleCompra = await _context.DetalleCompra.FindAsync(model.id);
                if (detalleCompra == null)
                {
                    return NotFound();
                }

                _context.DetalleCompra.Remove(detalleCompra);
                await _context.SaveChangesAsync();
                //eliminar registros detalleCompra asociados a compraId

                //consultar los registros de detalleCompra asociados a la compra
                var listDetalleCompra = _context.DetalleCompra.ToList()
                    .Where(dc => dc.IdCompra == model.idCompra);

                //Actualizar el registro de compra en bd, total de compra acorde a los detalles
                double totalCompra = 0;
                foreach (var item in listDetalleCompra)
                {
                    totalCompra = totalCompra + item.SubTotalCompra;
                }
                var compra = _context.Compra.SingleOrDefault(c => c.IdCompra == model.idCompra);
                compra.TotalCompra = totalCompra;
                _context.Compra.Update(compra);
                await _context.SaveChangesAsync();

                return Ok(detalleCompra);
            }
            catch (Exception ex)
            {
                var errorResponse = new ErrorResponse
                {
                    ErrorCode = "500",
                    ErrorMessage = "Ocurrió un error al ejecutar la operación"
                };

                return BadRequest(errorResponse);
            }

        }

        [HttpPost("listDetail", Name = "GetDetalleCompra")]
        public async Task<ActionResult<IEnumerable<DetalleCompraListarDto>>> GetDetalleCompra([FromBody] DeleteByIdInputDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {

                List<DetalleCompra> detallesCompra = await _context.DetalleCompra
                    .Where(dc => dc.IdCompra == model.id)
                    .ToListAsync();
         
                if (detallesCompra.Count() < 1)
                {
                    return NotFound();
                }
                List<DetalleCompraListarDto> detallesCompraDto = new List<DetalleCompraListarDto> ();

                foreach (var detalleCompra in detallesCompra)
                {
                    var existencia = _context.Existencia.SingleOrDefault(e => e.IdExistencias == detalleCompra.IdExistencias);
                    if (existencia == null)
                    {
                        return NotFound();
                    }
                    var producto= _context.Productos.SingleOrDefault(p => p.IdProductos == existencia.IdProductos);

                    var categoria = _context.Categoria.SingleOrDefault(c => c.IdCategoria == producto.IdCategoria);

                 
                   detallesCompraDto.Add(new DetalleCompraListarDto
                   {
                      IdDetalleCompra = detalleCompra.IdDetalleCompra,
                      IdCompra = detalleCompra.IdCompra,
                      Categoria = categoria.NombreCategoria,
                      NombreProducto = producto.NombreProducto,
                      ReferenciaProducto = producto.ReferenciaProducto,
                      CantidadProductos = detalleCompra.CantidadProductos,
                      PrecioProducto = detalleCompra.SubTotalCompra / detalleCompra.CantidadProductos,
                      IdExistencia = existencia.IdExistencias,
                      SubTotal = detalleCompra.SubTotalCompra
                   });

                }

                Console.WriteLine("list detalleCompraDto->" + detallesCompraDto.Count);
                return Ok(detallesCompraDto);
            }
            catch (Exception ex)
            {
                var errorResponse = new ErrorResponse
                {
                    ErrorCode = "500",
                    ErrorMessage = "Ocurrió un error al ejecutar la operación"
                };

                return BadRequest(errorResponse);
            }

        }

    }
}