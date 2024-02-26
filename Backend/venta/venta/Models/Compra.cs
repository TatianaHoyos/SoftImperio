using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace venta.Model
{
    [Table("compra")]
    public class Compra
    {
        [Key]
        public int IdCompra { get; set; }
        public DateTime FechaCompra { get; set; }
        public double? TotalCompra { get; set; }
    }

}
