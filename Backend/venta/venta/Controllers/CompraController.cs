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
    public class CompraController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CompraController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Compra
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Compra>>> GetCompras()
        {
          if (_context.Compras == null)
          {
              return NotFound();
          }
            return await _context.Compras.ToListAsync();
        }

        // GET: api/Compra/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Compra>> GetCompra(int id)
        {
          if (_context.Compras == null)
          {
              return NotFound();
          }
            if(id==1090208030){
                Console.WriteLine("if last");
                var compra = await _context.Compras
                .OrderBy(x => x.IdCompra)
              .LastOrDefaultAsync();

                if (compra == null)
                {
                    // If there is no element, return a default object with IdCompra equal to 0
                    return new Compra { IdCompra = 0 };
                }

                return compra;
            } else
            {
                var compra = await _context.Compras.FindAsync(id);

                if (compra == null)
                {
                    return NotFound();
                }

                return compra;
            }
           
        }

     

        // PUT: api/Compra/5
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

        // POST: api/Compra
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

        // DELETE: api/Compra/5
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
            //consulta detalles asociados a la compra
            Console.WriteLine("------------------------------"+id);

            //validar fecha de compra
            bool isCompraIsNotEditable = validarFechaCompra(compra.FechaCompra);

            if (isCompraIsNotEditable)
            {
                return BadRequest("No puedes editar o eliminar una compra después de 24 horas.");

            }
            else {

                 var detallesCompra = _context.DetalleCompra
                .Where(dc => dc.IdCompra == id)
                .ToList();
         
                //Eliminar cada detalle de compra encontrado
                foreach (var detalleCompra in detallesCompra)
                {
                    _context.DetalleCompra.Remove(detalleCompra);

                }
                await _context.SaveChangesAsync();

                _context.Compras.Remove(compra);
                await _context.SaveChangesAsync();

                return NoContent();
            }
        }

        private bool CompraExists(int id)
        {
            return (_context.Compras?.Any(e => e.IdCompra == id)).GetValueOrDefault();
        }

              private bool validarFechaCompra(DateTime fechaCompra)
        {
            // Agregar la validación de tiempo aquí
            var tiempoLimiteEliminar = TimeSpan.FromHours(24);
            var tiempoTranscurridoEliminar = DateTime.Now - fechaCompra;

            return tiempoTranscurridoEliminar > tiempoLimiteEliminar;
            
        }


    }
}
