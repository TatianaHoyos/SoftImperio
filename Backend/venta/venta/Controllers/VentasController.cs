﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using venta.Data;
using venta.DTO;
using venta.DTO.Pedido;
using venta.Models;
using venta.SignalR;

namespace venta.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class VentasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<MiClaseSignalR> _hubContext;

        public VentasController(ApplicationDbContext context, IHubContext<MiClaseSignalR> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        // GET: api/Ventas/ByFecha
        [HttpGet("ByFecha")]
        public async Task<ActionResult<IEnumerable<Venta>>> GetVentasPorFecha(DateTime fechaInicio, DateTime fechaFin)
        {
            if (_context.Ventas == null)
            {
                return NotFound();
            }

            var ventas = await _context.Ventas
                .Where(venta => venta.fechaVenta >= fechaInicio && venta.fechaVenta <= fechaFin)
                .ToListAsync();

            return ventas;

        }
        // GET: api/Ventas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Venta>>> GetVentas()
        {
          if (_context.Ventas == null)
          {
              return NotFound();
          }
            return await _context.Ventas.ToListAsync();
        }

        // GET: api/Ventas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Venta>> GetVenta(int id)
        {
          if (_context.Ventas == null)
          {
              return NotFound();
          }
            var venta = await _context.Ventas.FindAsync(id);

            if (venta == null)
            {
                return NotFound();
            }

            return venta;
        }

        // PUT: api/Ventas/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVenta(int id, Venta venta)
        {
            if (id != venta.idVenta)
            {
                return BadRequest();
            }

            _context.Entry(venta).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VentaExists(id))
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

        // POST: api/Ventas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Venta>> PostVenta(Venta venta)
        {
          if (_context.Ventas == null)
          {
              return Problem("Entity set 'ApplicationDbContext.Ventas'  is null.");
          }
            _context.Ventas.Add(venta);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVenta", new { id = venta.idVenta }, venta);
        }

        // DELETE: api/Ventas/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVenta(int id)
        {
            if (_context.Ventas == null)
            {
                return NotFound();
            }
            var venta = await _context.Ventas.FindAsync(id);
            if (venta == null)
            {
                return NotFound();
            }

            _context.Ventas.Remove(venta);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VentaExists(int id)
        {
            return (_context.Ventas?.Any(e => e.idVenta == id)).GetValueOrDefault();
        }

        // POST: api/Ventas
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Route("Mesa")]
        public async Task<ActionResult<Pedido>> PostVentaMesa(Pedido pedido)
        {
            if (_context.PuntoDeVentaEnMesa == null)
            {
                return NotFound();
            }
            //_context.PuntoDeVentaEnMesa.Add(venta);
            //await _context.SaveChangesAsync();

            var response = new Response
            {
                message = "El pedido de mesa se agrego correctamente",
                status = "Success"
            };

            // Notificar a los clientes a través de SignalR
            _hubContext.Clients.All.SendAsync("ReceiveMessage", "id del pedido " + pedido.pedido[0].idProducto 
                +" - cantidad "+ pedido.pedido[0].cantidad, "Usuario");

            // Serializar la instancia en formato JSON y retornarla como JsonResult
            return new JsonResult(response);
        }
    }
}