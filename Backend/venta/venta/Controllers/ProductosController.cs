using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using venta.Data;
using venta.DTO;
using venta.Models;


namespace venta.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Productos
        //[HttpGet]
        //public async Task<ActionResult<IEnumerable<object>>> GetProductos()
        //{
        //  if (_context.Productos == null)
        //  {
        //      return NotFound();
        //  }
        //    var listaProductosConExistencia = _context.Productos
        //         .Include(p => p.Categoria)  // Si quieres incluir la categoría en la consulta
        //         .Join(
        //             _context.Existencia,
        //             producto => producto.IdProductos,
        //             existencia => existencia.IdProductos,
        //             (producto, existencia) => new { Producto = producto, Existencia = existencia }
        //         )
        //         .ToList();
        //    return listaProductosConExistencia;
        //}

        [HttpGet]
        [Route("Agrupados")]
        public async Task<ActionResult<IEnumerable<object>>> GetProductosAgrupados()
        {
            if (_context.Productos == null)
            {
                return NotFound();
            }
            var listaExistencias = await _context.Existencia.ToListAsync();
            var listaProductos = await _context.Productos.ToListAsync();
            // Usamos LINQ para agrupar por NombreProducto y crear una lista de ReferenciaProducto para cada grupo.

            var productosTransformados = listaProductos
    .GroupBy(producto => producto.IdCategoria)
    .Select(grupoCategoria => new
    {
        IdCategoria = grupoCategoria.Key.ToString(),
        Productos = grupoCategoria
            .GroupBy(producto => producto.NombreProducto)
            .Select(grupoProducto => new
            {
                NombreProducto = grupoProducto.Key,
                Foto = grupoProducto.Select(producto => producto.FotoProducto).First(),
                Referencias = grupoProducto
                    .Select(producto =>
                    {
                        var existencia = listaExistencias.FirstOrDefault(e => e.IdProductos == producto.IdProductos);

                        return new Referencia
                        {
                            IdProducto = producto.IdProductos,
                            NombreReferencia = producto.ReferenciaProducto,
                            Precio = producto.PrecioProducto,
                            Existencia = existencia != null && existencia.Cantidad > 0
                                ? new ExistenciaDto
                                {
                                    IdExistencias = existencia.IdExistencias,
                                    IdProductos = existencia.IdProductos,
                                    Stock = existencia.Stock,
                                    Cantidad = existencia.Cantidad,
                                    Estado = existencia.Estado
                                }
                                : null
                        };
                    })
                    .Where(referencia => referencia.Existencia != null && referencia.Existencia.Cantidad > 0)
                    .ToList()
            })
            .Where(producto => producto.Referencias.Any()) // Elimina productos sin referencias o con existencia cantidad cero
            .ToList()
    })
    .Where(categoria => categoria.Productos.Any()) // Elimina categorías sin productos
    .ToList();

            return Ok(productosTransformados);
        }











        [HttpGet("productos-con-existencias")]
        public ActionResult<IEnumerable<ProductoConExistenciaDTO>> ObtenerProductosConExistencias()
        {
            try
            {
                var productosConExistencias = _context.Productos
                    .Join(_context.Existencia,
                        producto => producto.IdProductos,
                        existencia => existencia.IdProductos,
                        (producto, existencia) => new { producto, existencia })
                    .Select(pe => new ProductoConExistenciaDTO
                    {
                        NombreProducto = pe.producto.NombreProducto,
                        ReferenciaProducto = pe.producto.ReferenciaProducto,
                        Cantidad = pe.existencia.Cantidad
                    })
                    .ToList();

                return Ok(productosConExistencias);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al obtener productos con existencias");
            }
        }

    }

}
