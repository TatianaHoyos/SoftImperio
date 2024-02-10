using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using venta.Data;
using venta.DTO;
using venta.Model;

namespace venta.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComprasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ComprasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Compras
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Compra>>> GetCompras()
        {
            if (_context.Compras == null)
            {
                return NotFound();
            }
            return await _context.Compras.ToListAsync();
        }

        // GET: api/Compras/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Compra>> GetCompra(int id)
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

            return compra;
        }

        //GET: api/compras/ultimo-mes
        [HttpGet("compras-ultimo-mes")]
        public ActionResult<IEnumerable<ComprasPorMesDTO>> ObtenerComprasUltimoMes()
        {
            try
            {
                // Obtener fecha de inicio del mes actual
                var fechaInicio = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                // Obtener fecha de inicio del mes siguiente
                var fechaFin = fechaInicio.AddMonths(1);

                var comprasUltimoMes = _context.Compras
                    .Where(c => c.FechaCompra.HasValue && c.FechaCompra >= fechaInicio && c.FechaCompra < fechaFin)
                    .GroupBy(c => new { Año = c.FechaCompra.Value.Year, Mes = c.FechaCompra.Value.Month })
                    .Select(g => new ComprasPorMesDTO
                    {
                        Año = g.Key.Año,
                        Mes = g.Key.Mes,
                        TotalCompra = g.Sum(c => c.TotalCompra)
                    })
                    .ToList();

                return Ok(comprasUltimoMes);
            }
            catch (Exception ex)
            {
               
                return BadRequest("Error al obtener las compras del último mes");
            }
        }



        [HttpGet("compras-por-mes")]
        public ActionResult<IEnumerable<ComprasPorMesDTO>> ObtenerComprasUltimos12Meses()
        {
            try
            {
                var fechaInicio = DateTime.Now.AddMonths(-12);

                var comprasUltimos12Meses = _context.Compras
                    .Where(c => c.FechaCompra.HasValue && c.FechaCompra.Value >= fechaInicio)
                    .GroupBy(c => new { Año = c.FechaCompra.Value.Year, Mes = c.FechaCompra.Value.Month })
                    .Select(g => new ComprasPorMesDTO
                    {
                        Año = g.Key.Año,
                        Mes = g.Key.Mes,
                        TotalCompra = g.Sum(c => c.TotalCompra)
                    })
                    .OrderBy(g => g.Año)
                    .ThenBy(g => g.Mes)
                    .ToList();

                return Ok(comprasUltimos12Meses);
            }
            catch (Exception ex)
            {
                // Manejar el error según tus necesidades
                return BadRequest("Error al obtener las compras por mes");
            }
        }







        // PUT: api/Compras/5
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

        // POST: api/Compras
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

        // DELETE: api/Compras/5
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

            _context.Compras.Remove(compra);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CompraExists(int id)
        {
            return (_context.Compras?.Any(e => e.IdCompra == id)).GetValueOrDefault();
        }
    }
}
