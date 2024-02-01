using venta.Models;

namespace venta.DTO
{
    public class CreditosDTO
    {
        public int IdCreditos { get; set; }
        public int IdUsuarioCredito { get; set; }
        public int IdVenta { get; set; }
        public decimal PrecioCredito { get; set; }
        public DateTime FechaCredito { get; set; }
        public string Nombre { get; set; }
        public string Telefono { get; set; }
        public UsuarioCredito UsuarioCredito { get; set; }



    }
}
