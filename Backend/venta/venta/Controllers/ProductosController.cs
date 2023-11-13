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
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetProductos()
        {
          if (_context.Productos == null)
          {
              return NotFound();
          }
            return await _context.Productos.ToListAsync();
            
        }

        [HttpGet]
        [Route("Agrupados")]
        public async Task<ActionResult<IEnumerable<object>>> GetProductosAgrupados()
        {
            if (_context.Productos == null)
            {
                return NotFound();
            }
            var listaProductos = await _context.Productos.ToListAsync();
            // Usamos LINQ para agrupar por NombreProducto y crear una lista de ReferenciaProducto para cada grupo.
            var productosTransformados = listaProductos
               .GroupBy(producto => producto.IdCategoria)
               .Select(grupoCategoria => new CategoriaProducto
               {
                   IdCategoria = grupoCategoria.Key.ToString(),
                   Productos = grupoCategoria
                       .GroupBy(producto => producto.NombreProducto)
                       .Select(grupoProducto => new ProductoTransformado
                       {
                           NombreProducto = grupoProducto.Key,
                           Foto = grupoProducto.Select(producto => producto.FotoProducto).First(),
                           Referencias = grupoProducto.Select(producto => new Referencia
                           {
                               IdProducto = producto.IdProductos,
                               NombreReferencia = producto.ReferenciaProducto,
                               Precio = producto.PrecioProducto,
                             //  Cantidad = producto.Cantidad
                           }).ToList()
                       }).ToList()
               }).ToList();

            return Ok(productosTransformados);
        }

        // GET: api/Productos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Productos>> GetProductos(int id)
        {
          if (_context.Productos == null)
          {
              return NotFound();
          }
            var productos = await _context.Productos.FindAsync(id);

            if (productos == null)
            {
                return NotFound();
            }

            return productos;
        }

        // PUT: api/Productos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProductos(int id, Productos productos)
        {
            if (id != productos.IdProductos)
            {
                return BadRequest();
            }

            _context.Entry(productos).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductosExists(id))
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

        // POST: api/Productos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Productos>> PostProductos(Productos productos)
        {
          if (_context.Productos == null)
          {
              return Problem("Entity set 'ApplicationDbContext.Productos'  is null.");
          }
            _context.Productos.Add(productos);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProductos", new { id = productos.IdProductos }, productos);
        }

        // DELETE: api/Productos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProductos(int id)
        {
            if (_context.Productos == null)
            {
                return NotFound();
            }
            var productos = await _context.Productos.FindAsync(id);
            if (productos == null)
            {
                return NotFound();
            }

            _context.Productos.Remove(productos);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductosExists(int id)
        {
            return (_context.Productos?.Any(e => e.IdProductos == id)).GetValueOrDefault();
        }
    }
}
