using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace venta.Models
{
    [Table("detalleventa")]
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
