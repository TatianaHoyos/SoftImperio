    using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace venta.Dto
{
    public class DetalleCompraInputDto
    {
        [Required]
        public int IdCompra { get; set; }
        [Required]
        public int IdExistencias { get; set; }
        [Required]
        public int CantidadProductos { get; set; }
        [Required]
        public double Precio { get; set; }
        [Required]
        public string accion { get; set; }
        public int IdDetalleCompra { get; set; }

    }
}
