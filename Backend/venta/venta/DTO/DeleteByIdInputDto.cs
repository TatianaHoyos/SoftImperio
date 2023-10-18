using System.ComponentModel.DataAnnotations;

namespace venta.Dto
{
    public class DeleteByIdInputDto
    {
        [Required]
        public int id { get; set; }


    }

}
