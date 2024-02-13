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
    public class DetalleVentasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DetalleVentasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/DetalleVentas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DetalleVenta>>> GetDetalleVenta()
        {
          if (_context.DetalleVenta == null)
          {
              return NotFound();
          }
            return await _context.DetalleVenta.ToListAsync();
        }



        // GET: api/DetalleVentas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DetalleVenta>> GetDetalleVenta(int id)
        {
          if (_context.DetalleVenta == null)
          {
              return NotFound();
          }
            var detalleVenta = await _context.DetalleVenta.FindAsync(id);

            if (detalleVenta == null)
            {
                return NotFound();
            }

            return detalleVenta;
        }

        // PUT: api/DetalleVentas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDetalleVenta(int id, DetalleVenta detalleVenta)
        {
            if (id != detalleVenta.idDetalleVenta)
            {
                return BadRequest();
            }

            _context.Entry(detalleVenta).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DetalleVentaExists(id))
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

        // POST: api/DetalleVentas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DetalleVenta>> PostDetalleVenta(DetalleVenta detalleVenta)
        {
          if (_context.DetalleVenta == null)
          {
              return Problem("Entity set 'ApplicationDbContext.DetalleVenta'  is null.");
          }
            _context.DetalleVenta.Add(detalleVenta);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDetalleVenta", new { id = detalleVenta.idDetalleVenta }, detalleVenta);
        }

        // DELETE: api/DetalleVentas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDetalleVenta(int id)
        {
            if (_context.DetalleVenta == null)
            {
                return NotFound();
            }
            var detalleVenta = await _context.DetalleVenta.FindAsync(id);
            if (detalleVenta == null)
            {
                return NotFound();
            }

            _context.DetalleVenta.Remove(detalleVenta);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DetalleVentaExists(int id)
        {
            return (_context.DetalleVenta?.Any(e => e.idDetalleVenta == id)).GetValueOrDefault();
        }


        // GET: api/DetalleVentas/ByVenta/{idVenta}
        [HttpGet("ByVenta/{idVenta}")]
        public async Task<ActionResult<IEnumerable<DetalleVentaDTO>>> GetDetallesVentaPorIdVenta(int idVenta)
        {
            var detallesVenta = await _context.DetalleVenta
                .Where(detalle => detalle.IdVenta == idVenta)
                .Select(detalle => new DetalleVentaDTO
                {
                    
                    CantidadProducto = detalle.CantidadProducto,
                    SubTotalAPagar = detalle.SubTotalAPagar,
                    NombreProducto = _context.Existencia
                                      .Where(e => e.IdExistencias == detalle.IdExistencias)
                                      .Select(e => _context.Productos
                                                      .Where(p => p.IdProductos == e.IdProductos)
                                                      .Select(p => p.NombreProducto)
                                                      .FirstOrDefault())
                                      .FirstOrDefault()
                })
                .ToListAsync();

            return detallesVenta;
        }


    }
}
