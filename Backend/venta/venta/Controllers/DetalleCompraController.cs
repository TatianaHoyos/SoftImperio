using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
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
                Console.WriteLine("not found");

                return NotFound();
            }
            Console.WriteLine("Se consulto algo....");

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

        [HttpGet("ObtenerDetalleCompraPorIdCompra/{idCompra}")]
        public IActionResult ObtenerDetalleCompraPorIdCompra(int idCompra)
        {
            var parameter = new MySqlParameter("@p_idCompra", idCompra);
            var detalleCompraResults = _context.DetalleCompraResult
                           .FromSqlRaw("CALL ObtenerDetalleCompraPorIdCompra(@p_idCompra)", parameter)
                           .ToList();

            if (detalleCompraResults == null || detalleCompraResults.Count == 0)
            {
                return NotFound();
            }

            return Ok(detalleCompraResults);
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
            var oldDC = _context.DetalleCompra.Where(dc => dc.IdDetalleCompra == detalleCompra.IdDetalleCompra).First();
            var oldSubtotal = oldDC.PrecioCompra * oldDC.CantidadProducto;

            var updateCompra = _context.Compras.Where(c => c.IdCompra == detalleCompra.IdCompra).First();
            updateCompra.TotalCompra -= oldSubtotal;
            updateCompra.TotalCompra += detalleCompra.PrecioCompra * detalleCompra.CantidadProducto;



            try
            {
                bool isCompraIsNotEditable = validarFechaCompra(updateCompra.FechaCompra);

                if (isCompraIsNotEditable)
                {
                    return BadRequest("No puedes editar o eliminar una compra después de 24 horas.");

                }
                else
                {

                    oldDC.CantidadProducto = detalleCompra.CantidadProducto;
                    oldDC.IdProveedores = detalleCompra.IdProveedores;
                    oldDC.PrecioCompra = detalleCompra.PrecioCompra;
                    oldDC.SubTotalCompra = detalleCompra.PrecioCompra * detalleCompra.CantidadProducto;
                    oldDC.IdExistencias = detalleCompra.IdExistencias;

                    _context.DetalleCompra.Update(oldDC);
                    await _context.SaveChangesAsync();


                    _context.Compras.Update(updateCompra);
                    await _context.SaveChangesAsync();
                }

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
            var compra = _context.Compras.Where(c => c.IdCompra == detalleCompra.IdCompra).ToList();
            if (compra.Count == 0)
            {
                var newCompra = new Compra();
                newCompra.IdCompra = detalleCompra.IdCompra;
                newCompra.TotalCompra = 0;
                newCompra.FechaCompra = DateTime.Now;
                _context.Compras.Add(newCompra);
                await _context.SaveChangesAsync();
            }

            //validar fecha compra
            bool isCompraIsNotEditable = validarFechaCompra(compra[0].FechaCompra);
            if (isCompraIsNotEditable)
            {
                return BadRequest("No puedes editar o eliminar una compra después de 24 horas.");

            }
            else
            {

                List<DetalleCompra> listDCompra = new List<DetalleCompra>();
                listDCompra = _context.DetalleCompra
                    .Where(dc => dc.IdCompra == detalleCompra.IdCompra && dc.PrecioCompra == detalleCompra.PrecioCompra && dc.IdExistencias == detalleCompra.IdExistencias && dc.IdProveedores == detalleCompra.IdProveedores).ToList();

                if (listDCompra.Count() == 0)
                {
                    _context.DetalleCompra.Add(detalleCompra);
                    await _context.SaveChangesAsync();

                    var updateCompra = _context.Compras.Where(c => c.IdCompra == detalleCompra.IdCompra).First();
                    updateCompra.TotalCompra += detalleCompra.CantidadProducto * detalleCompra.PrecioCompra;
                    _context.Compras.Update(updateCompra);
                    await _context.SaveChangesAsync();
                    return CreatedAtAction("GetDetalleCompra", new { id = detalleCompra.IdDetalleCompra }, detalleCompra);

                }
                else
                {
                    listDCompra[0].CantidadProducto += detalleCompra.CantidadProducto;
                    _context.DetalleCompra.Update(listDCompra[0]);
                    await _context.SaveChangesAsync();

                    var updateCompra = _context.Compras.Where(c => c.IdCompra == detalleCompra.IdCompra).First();
                    updateCompra.TotalCompra += detalleCompra.CantidadProducto * detalleCompra.PrecioCompra;
                    _context.Compras.Update(updateCompra);
                    await _context.SaveChangesAsync();
                    return CreatedAtAction("GetDetalleCompra", new { id = detalleCompra.IdDetalleCompra }, detalleCompra);

                };

            }

        }

        private bool validarFechaCompra(DateTime fechaCompra)
        {
            // Agregar la validación de tiempo aquí
            var tiempoLimiteEliminar = TimeSpan.FromHours(24);
            var tiempoTranscurridoEliminar = DateTime.Now - fechaCompra;

            return tiempoTranscurridoEliminar > tiempoLimiteEliminar;

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
            var oldSubtotal = detalleCompra.SubTotalCompra;
            if (detalleCompra == null)
            {
                return NotFound();
            }
            var updateCompra = _context.Compras.Where(c => c.IdCompra == detalleCompra.IdCompra).First();

            //validar fecha de compra
            bool isCompraIsNotEditable = validarFechaCompra(updateCompra.FechaCompra);

            if (isCompraIsNotEditable)
            {
                return BadRequest("No puedes editar o eliminar una compra después de 24 horas.");

            }
            else
            {

                _context.DetalleCompra.Remove(detalleCompra);
                await _context.SaveChangesAsync();

                updateCompra.TotalCompra = updateCompra.TotalCompra - (detalleCompra.CantidadProducto * detalleCompra.PrecioCompra);
                _context.Compras.Update(updateCompra);
                await _context.SaveChangesAsync();

                return NoContent();
            }
        }

        private bool DetalleCompraExists(int id)
        {
            return (_context.DetalleCompra?.Any(e => e.IdDetalleCompra == id)).GetValueOrDefault();
        }
    }
}

