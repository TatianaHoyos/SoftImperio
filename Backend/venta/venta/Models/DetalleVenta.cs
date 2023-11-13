using System.ComponentModel.DataAnnotations;

namespace venta.Models
{
    public class DetalleVenta
    {
        [Key]
        public int idDetalleVenta { get; set; }
        public int IdExistencias { get; set; }
        public int IdVenta { get; set; }
        public int CantidadProducto { get; set; }
        public float SubTotalAPagar { get; set; }


    }
}
