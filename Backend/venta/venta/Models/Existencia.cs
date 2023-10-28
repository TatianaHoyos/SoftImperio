using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace venta.Model
{
    [Table("existencia")]
    public class Existencia
    {
        [Key]
        public int IdExistencias { get; set; }
        public int IdProductos { get; set; }
        public int? Stock { get; set; }
        public int? Cantidad { get; set; }
        public char? Estado { get; set; }
        public int? IdDetalleCompra { get; set; }
        public int? IdCreditos { get; set; }
    }
}
