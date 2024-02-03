using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using venta.Data;
using venta.Model;

namespace venta.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DetalleCompraController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DetalleCompraController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/DetalleCompra
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DetalleCompra>>> GetDetalleCompra()
        {
          if (_context.DetalleCompra == null)
          {
              return NotFound();
          }
            return await _context.DetalleCompra.ToListAsync();
        }

        // GET: api/DetalleCompra/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DetalleCompra>> GetDetalleCompra(int id)
        {
          if (_context.DetalleCompra == null)
          {
              return NotFound();
          }
            var detalleCompra = await _context.DetalleCompra.FindAsync(id);

            if (detalleCompra == null)
            {
                return NotFound();
            }

            return detalleCompra;
        }

        // PUT: api/DetalleCompra/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDetalleCompra(int id, DetalleCompra detalleCompra)
        {
            if (id != detalleCompra.IdDetalleCompra)
            {
                return BadRequest();
            }

            _context.Entry(detalleCompra).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DetalleCompraExists(id))
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

        // POST: api/DetalleCompra
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DetalleCompra>> PostDetalleCompra(DetalleCompra detalleCompra)
        {
          if (_context.DetalleCompra == null)
          {
              return Problem("Entity set 'ApplicationDbContext.DetalleCompra'  is null.");
          }
            _context.DetalleCompra.Add(detalleCompra);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDetalleCompra", new { id = detalleCompra.IdDetalleCompra }, detalleCompra);
        }

        // DELETE: api/DetalleCompra/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDetalleCompra(int id)
        {
            if (_context.DetalleCompra == null)
            {
                return NotFound();
            }
            var detalleCompra = await _context.DetalleCompra.FindAsync(id);
            if (detalleCompra == null)
            {
                return NotFound();
            }

            _context.DetalleCompra.Remove(detalleCompra);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DetalleCompraExists(int id)
        {
            return (_context.DetalleCompra?.Any(e => e.IdDetalleCompra == id)).GetValueOrDefault();
        }
    }
}
