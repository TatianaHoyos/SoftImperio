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
    public class UsuarioCreditosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsuarioCreditosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/UsuarioCreditos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsuarioCredito>>> GetUsuarioCredito()
        {
          if (_context.UsuarioCredito == null)
          {
              return NotFound();
          }
            return await _context.UsuarioCredito.ToListAsync();
        }

        // GET: api/UsuarioCreditos/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UsuarioCredito>> GetUsuarioCredito(int id)
        {
          if (_context.UsuarioCredito == null)
          {
              return NotFound();
          }
            var usuarioCredito = await _context.UsuarioCredito.FindAsync(id);

            if (usuarioCredito == null)
            {
                return NotFound();
            }

            return usuarioCredito;
        }

        // PUT: api/UsuarioCreditos/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuarioCredito(int id, UsuarioCredito usuarioCredito)
        {
            if (id != usuarioCredito.IdUsuarioCredito)
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

            _context.Entry(usuarioCredito).State = EntityState.Modified;

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
                if (!UsuarioCreditoExists(id))
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

        // POST: api/UsuarioCreditos
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<UsuarioCredito>> PostUsuarioCredito(UsuarioCredito usuarioCredito)
        {
          if (_context.UsuarioCredito == null)
          {
                var errorResponse = new Response
                {
                    message = "Entity set 'ApplicationDbContext.UsuarioCredito' is null.",
                    status = "Error"
                };
                return new JsonResult(errorResponse) { StatusCode = 500 }; // Usar un código de estado adecuado, como 500 Internal Server Error
          }
            _context.UsuarioCredito.Add(usuarioCredito);
            await _context.SaveChangesAsync();

            var successResponse = new Response
            {
                message = "El usuario crédito se agregó correctamente.",
                status = "Success"
            };

            return new JsonResult(successResponse) { StatusCode = 201 }; // Usar un código de estado adecuado, como 201 Created
        }


        // DELETE: api/UsuarioCreditos/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuarioCredito(int id)
        {
            if (_context.UsuarioCredito == null)
            {
                return NotFound();
            }
            var usuarioCredito = await _context.UsuarioCredito.FindAsync(id);
            if (usuarioCredito == null)
            {
                return NotFound();
            }

            _context.UsuarioCredito.Remove(usuarioCredito);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UsuarioCreditoExists(int id)
        {
            return (_context.UsuarioCredito?.Any(e => e.IdUsuarioCredito == id)).GetValueOrDefault();
        }
    }
}
