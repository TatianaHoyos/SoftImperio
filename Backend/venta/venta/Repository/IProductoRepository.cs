using venta.Model;
using venta.Models;

namespace venta.Repository
{
    public interface IProductoRepository
    {
        List<Productos> ObtenerProductos(List<int> idsProductos);
        List<Existencia> ObtenerExitencia(List<int> idsProductos);
    }
}
