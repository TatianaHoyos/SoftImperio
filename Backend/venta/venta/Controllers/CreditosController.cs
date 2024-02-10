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
    public class CreditosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CreditosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Creditos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Creditos>>> GetCreditos()
        {
            if (_context.Creditos == null)
            {
                return NotFound();
            }
            return await _context.Creditos.ToListAsync();
        }



        // GET: api/Creditos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Creditos>> GetCreditos(int id)
        {
            if (_context.Creditos == null)
            {
                return NotFound();
            }
            var creditos = await _context.Creditos.FindAsync(id);

            if (creditos == null)
            {
                return NotFound();
            }

            return creditos;
        }

        //GET: api/Creditos/creditos-ultimo-mes
        [HttpGet("creditos-ultimo-mes")]
        public ActionResult<IEnumerable<CreditosPorMesDTO>> ObtenerCreditosUltimoMes()
        {
            try
            {
                var fechaInicio = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                var fechaFin = fechaInicio.AddMonths(1);

                var creditosUltimoMes = _context.Creditos
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




        // PUT: api/Creditos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCreditos(int id, Creditos creditos)
        {
            if (id != creditos.IdCreditos)
            {
                // Crear una instancia de Response para un error
                var errorResponse = new Response
                {
                    message = "Usuario crédito no encontrado.",
                    status = "Error"
                };

                // Serializar la instancia en formato JSON y retornarla como JsonResult
                return new JsonResult(errorResponse) { StatusCode = 400 };
            }

            _context.Entry(creditos).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                // Crear una instancia de Response con los valores adecuados
                var response = new Response
                {
                    message = "El usuario crédito se actualizó correctamente.",
                    status = "Success"
                };

                // Serializar la instancia en formato JSON y retornarla como JsonResult
                return new JsonResult(response);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CreditosExists(id))
                {
                    // Crear una instancia de Response para un error
                    var errorResponse = new Response
                    {
                        message = "Usuario crédito no encontrado.",
                        status = "Error"
                    };

                    // Serializar la instancia en formato JSON y retornarla como JsonResult
                    return new JsonResult(errorResponse) { StatusCode = 404 };
                }
                else
                {
                    throw;
                }
            }
        }

        // POST: api/Creditos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Creditos>> PostCreditos(Creditos creditos)
        {
          if (_context.Creditos == null)
          {
                var errorResponse = new Response
                {
                    message = "Entity set 'ApplicationDbContext.Creditos'  is null.",
                    status = "Error"
                };
                return new JsonResult(errorResponse) { StatusCode = 500 }; // Usar un código de estado adecuado, como 500 Internal Server Error
            }
            _context.Creditos.Add(creditos);
            await _context.SaveChangesAsync();

            var successResponse = new Response
            {
                message = "El crédito se agregó correctamente.",
                status = "Success"
            };

            return new JsonResult(successResponse) { StatusCode = 201 }; // Usar un código de estado adecuado, como 201 Created
        }

        // DELETE: api/Creditos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCreditos(int id)
        {
            if (_context.Creditos == null)
            {
                return NotFound();
            }
            var creditos = await _context.Creditos.FindAsync(id);
            if (creditos == null)
            {
                return NotFound();
            }

            _context.Creditos.Remove(creditos);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CreditosExists(int id)
        {
            return (_context.Creditos?.Any(e => e.IdCreditos == id)).GetValueOrDefault();
        }
    }
}
