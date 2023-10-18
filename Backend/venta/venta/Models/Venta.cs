using System.ComponentModel.DataAnnotations;

namespace venta.Models
{
    public class Venta
    {
        [Key]
        public int idVenta { get; set; }
        //public int idVentaEnBarra { get; set; }

        public DateTime fechaVenta { get; set; }

        public float totalVenta { get; set; }
    }
}
