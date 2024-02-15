using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using venta.Models;

namespace venta.Models
{
    [Table("creditos")]
    public class Creditos
    {
        [Key]
        public int IdCreditos { get; set; }
        public int IdUsuarioCredito  { get; set; }
        public int IdVenta {get; set; }
        public float PrecioCredito { get; set; }
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime Fecha { get; set; }
    }
}
