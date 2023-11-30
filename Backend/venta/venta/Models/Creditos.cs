using System.ComponentModel.DataAnnotations;

namespace venta.Models
{
    public class Creditos
    {
        [Key]
        public int IdCreditos { get; set; }
        public int? IdUsuarios { get; set; }
        public int? IdUsuarioCredito { get; set; }
        public int? IdVenta { get; set; }
        public double PrecioCredito { get; set; }
        public DateTime FechaCredito { get; set; }
         
    }
}
