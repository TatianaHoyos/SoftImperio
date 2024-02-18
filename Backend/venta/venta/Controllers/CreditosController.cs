using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using venta.Data;
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
        public async Task<ActionResult<IEnumerable<Creditos>>> Getcreditos()
        {
            if (_context.creditos == null)
            {
                return NotFound();
            }
            return await _context.creditos.ToListAsync();
        }

        // GET: api/Creditos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<Creditos>>> GetCreditos(int id)
        {
            var creditos = await _context.creditos.ToListAsync();

            var creditosList = creditos.Where(e => e.IdUsuarioCredito == id).ToList();

            if (creditosList == null)
            {
                return NotFound();
            }

            return creditosList;
        }

        // PUT: api/Creditos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCreditos(int id, Creditos creditos)
        {
            if (id != creditos.IdCreditos)
            {
                return BadRequest();
            }

            _context.Entry(creditos).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CreditosExists(id))
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

        // POST: api/Creditos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Creditos>> PostCreditos(Creditos creditos)
        {
            if (_context.creditos == null)
            {
                return Problem("Entity set 'ApplicationDbContext.creditos'  is null.");
            }
            _context.creditos.Add(creditos);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCreditos", new { id = creditos.IdCreditos }, creditos);
        }

        // DELETE: api/Creditos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCreditos(int id)
        {
            if (_context.creditos == null)
            {
                return NotFound();
            }
            var creditos = await _context.creditos.FindAsync(id);
            if (creditos == null)
            {
                return NotFound();
            }

            _context.creditos.Remove(creditos);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CreditosExists(int id)
        {
            return (_context.creditos?.Any(e => e.IdCreditos == id)).GetValueOrDefault();
        }
    }
}
