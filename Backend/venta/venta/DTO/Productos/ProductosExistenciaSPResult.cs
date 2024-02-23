using System.ComponentModel.DataAnnotations;

namespace venta.DTO.Productos
{
    public class ProductosExistenciaSPResult
    {
        [Key]
        public int IdProductos { get; set; }
        public int IdExistencias { get; set; }
        public string NombreProducto { get; set; }
    }
}
