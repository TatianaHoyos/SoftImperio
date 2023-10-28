using System.ComponentModel.DataAnnotations;

namespace venta.Dto
{
    public class DeleteDetalleByIdInputDto
    {
        [Required]
        public int id { get; set; }
        [Required]
        public int idCompra { get; set; }

    }

}
