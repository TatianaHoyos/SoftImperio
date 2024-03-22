using System.ComponentModel.DataAnnotations;

namespace venta.Models
{
    [Table("usuariocredito")]
    public class UsuarioCredito
    {
        [Key]
        public int IdUsuarioCredito { get; set; }
        public string Nombre { get; set; }
        public string Documento { get; set; }
        public string Telefono { get; set; }
        public float TotalCredito { get; set; }
    }
}
