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
    public class AbonoCreditosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AbonoCreditosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/AbonoCreditos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AbonoCredito>>> GetAbonoCreditos()
        {
          if (_context.AbonoCreditos == null)
          {
              return NotFound();
          }
            return await _context.AbonoCreditos.ToListAsync();
        }

        // GET: api/AbonoCreditos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<AbonoCredito>>> GetAbonoCredito(int id)
        {
          
            var abonoCredito = await _context.AbonoCreditos.ToListAsync();

            var abonoCreditoList = abonoCredito.Where(e=> e.IdUsuarioCredito == id).ToList();

            if (abonoCreditoList == null)
            {
                return NotFound();
            }

            return abonoCreditoList;
        }

        // PUT: api/AbonoCreditos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAbonoCredito(int id, AbonoCredito abonoCredito)
        {
            if (id != abonoCredito.IdAbono)
            {
                return BadRequest();
            }

            _context.Entry(abonoCredito).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AbonoCreditoExists(id))
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

        // POST: api/AbonoCreditos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<AbonoCredito>> PostAbonoCredito(AbonoCredito abonoCredito)
        {
          if (_context.AbonoCreditos == null)
          {
              return Problem("Entity set 'ApplicationDbContext.AbonoCreditos'  is null.");
          }
            _context.AbonoCreditos.Add(abonoCredito);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAbonoCredito", new { id = abonoCredito.IdAbono }, abonoCredito);
        }

        // DELETE: api/AbonoCreditos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAbonoCredito(int id)
        {
            if (_context.AbonoCreditos == null)
            {
                return NotFound();
            }
            var abonoCredito = await _context.AbonoCreditos.FindAsync(id);
            if (abonoCredito == null)
            {
                return NotFound();
            }

            _context.AbonoCreditos.Remove(abonoCredito);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool AbonoCreditoExists(int id)
        {
            return (_context.AbonoCreditos?.Any(e => e.IdAbono == id)).GetValueOrDefault();
        }
    }
}
