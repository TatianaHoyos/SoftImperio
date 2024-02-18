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
    public class DetalleCreditosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DetalleCreditosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/DetalleCreditos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DetalleCreditos>>> GetDetalleCreditos()
        {
          if (_context.DetalleCreditos == null)
          {
              return NotFound();
          }
            return await _context.DetalleCreditos.ToListAsync();
        }

        // GET: api/DetalleCreditos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DetalleCreditos>> GetDetalleCreditos(int id)
        {
          if (_context.DetalleCreditos == null)
          {
              return NotFound();
          }
            var detalleCreditos = await _context.DetalleCreditos.FindAsync(id);

            if (detalleCreditos == null)
            {
                return NotFound();
            }

            return detalleCreditos;
        }

        // PUT: api/DetalleCreditos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDetalleCreditos(int id, DetalleCreditos detalleCreditos)
        {
            if (id != detalleCreditos.IdDetalleCreditos)
            {
                return BadRequest();
            }

            _context.Entry(detalleCreditos).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DetalleCreditosExists(id))
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

        // POST: api/DetalleCreditos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<DetalleCreditos>> PostDetalleCreditos(DetalleCreditos detalleCreditos)
        {
          if (_context.DetalleCreditos == null)
          {
              return Problem("Entity set 'ApplicationDbContext.DetalleCreditos'  is null.");
          }
            _context.DetalleCreditos.Add(detalleCreditos);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDetalleCreditos", new { id = detalleCreditos.IdDetalleCreditos }, detalleCreditos);
        }

        // DELETE: api/DetalleCreditos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDetalleCreditos(int id)
        {
            if (_context.DetalleCreditos == null)
            {
                return NotFound();
            }
            var detalleCreditos = await _context.DetalleCreditos.FindAsync(id);
            if (detalleCreditos == null)
            {
                return NotFound();
            }

            _context.DetalleCreditos.Remove(detalleCreditos);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DetalleCreditosExists(int id)
        {
            return (_context.DetalleCreditos?.Any(e => e.IdDetalleCreditos == id)).GetValueOrDefault();
        }

        //GET: api/Creditos/creditos-ultimo-mes
        [HttpGet("creditos-ultimo-mes")]
        public ActionResult<IEnumerable<CreditosPorMesDTO>> ObtenerCreditosUltimoMes()
        {
            try
            {
                var fechaInicio = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                var fechaFin = fechaInicio.AddMonths(1);

                var creditosUltimoMes = _context.creditos
                    .Where(cr => cr.Fecha != null && cr.Fecha >= fechaInicio && cr.Fecha < fechaFin)
                    .GroupBy(cr => new { Año = cr.Fecha.Year, Mes = cr.Fecha.Month })
                    .Select(g => new CreditosPorMesDTO
                    {
                        Año = g.Key.Año,
                        Mes = g.Key.Mes,
                        TotalCredito = g.Sum(cr => cr.PrecioCredito)
                    })
                    .ToList();

                return Ok(creditosUltimoMes);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al obtener los créditos del último mes");
            }
        }
    }
}
