using System.ComponentModel.DataAnnotations;

namespace venta.Model
{
    public class DetalleCompra
    {
        [Key]
        public int IdDetalleCompra { get; set; }
        public int? IdCompra { get; set; }
        public int? IdExistencias { get; set; }
        public int CantidadProductos { get; set; }
        public double SubTotalCompra { get; set; }
    }
}
