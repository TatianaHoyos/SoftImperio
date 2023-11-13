using Microsoft.EntityFrameworkCore;
using venta.Data;
using venta.Model;
using venta.Models;

namespace venta.Repository
{
    public class ProductoService : IProductoRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductoService(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<Existencia> ObtenerExitencia(List<int> idsProductos)
        {
            // Filtra los productos por los ids proporcionados en el array
            var existencias = _context.Existencia
                .Where(p => idsProductos.Contains(p.IdProductos))
                .ToList();

            return existencias;
        }

        public List<Productos> ObtenerProductos(List<int> idsProductos)
        {
            // Filtra los productos por los ids proporcionados en el array
            var productos = _context.Productos
                .Where(p => idsProductos.Contains(p.IdProductos))
                .ToList();

            return productos;

        }
    }
}
