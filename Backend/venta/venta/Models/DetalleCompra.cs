using System.ComponentModel.DataAnnotations;

namespace venta.Model
{
    [Table("detallecompra")]
    public class DetalleCompra
    {
        [Key]
        public int IdDetalleCompra { get; set; }
        public int IdCompra { get; set; }
        public int? IdExistencias { get; set; }
        public int? IdProveedores { get; set; }
        public int CantidadProducto { get; set; }
        public double PrecioCompra { get; set; }
        public double SubTotalCompra { get; set; }
    }
}
