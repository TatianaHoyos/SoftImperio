using System.ComponentModel.DataAnnotations;

namespace venta.Models
{
    public class DetalleCreditos
    {
        [Key]
        public int IdDetalleCreditos { get; set; }
        public int? IdCreditos { get; set; }
        public DateTime FechaAbono { get; set; }
        public double PrecioAbono { get; set; }
       


    }
}
