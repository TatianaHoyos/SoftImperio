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
    public class CategoriasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Categorias
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias()
        {
          if (_context.Categoria == null)
          {
              return NotFound();
          }
            return await _context.Categoria.ToListAsync();
        }


        // PUT: api/Categorias/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoria(int id, Categoria categoria)
        {
            if (id != categoria.IdCategoria)
            {
                return BadRequest();
            }

            _context.Entry(categoria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CategoriaExists(id))
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
        // GET: api/categorias/1
        [HttpGet("{id}")]
        public ActionResult<Categoria> GetCategoria(int id)
        {
            // Implementación de la obtención de la categoría por ID
            var categoria = _context.Categoria.Find(id);

            if (categoria == null)
            {
                return NotFound();
            }

            return Ok(categoria);
        }

        // POST: api/categorias/crear
        [HttpPost("crear")]
        public async Task<ActionResult<Categoria>> PostCategoria(Categoria categoria)
        {
            try
            {
                if (_context.Categoria == null)
                {
                    return Problem("Entity set 'ApplicationDbContext.Categoria' is null.");
                }

                _context.Categoria.Add(categoria);
                await _context.SaveChangesAsync();

                // Asegúrate de que el nombre de la acción y los parámetros coincidan con la acción GetCategoria
                return CreatedAtAction("GetCategoria", new { id = categoria.IdCategoria }, categoria);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}. Inner Exception: {ex.InnerException?.Message}");
            }
        }
    



    // DELETE: api/Categorias1/5
    [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            if (_context.Categoria == null)
            {
                return NotFound();
            }
            var categoria = await _context.Categoria.FindAsync(id);
            if (categoria == null)
            {
                return NotFound();
            }

            _context.Categoria.Remove(categoria);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        private bool CategoriaExists(int id)
        {
            return (_context.Categoria?.Any(e => e.IdCategoria == id)).GetValueOrDefault();
        }

    }
}
