using System.ComponentModel.DataAnnotations;

namespace venta.Dto
{
    public class CompraInputDto
    {
        [Required]
        public DateTime FechaCompra { get; set; }

        [Required]
        public double TotalCompra { get; set; }

    }

}
