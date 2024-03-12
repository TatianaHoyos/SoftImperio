using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using venta.Models;


namespace venta.Models
{
    [Table("abonocredito")]
    public class AbonoCredito
    {
        [Key]
        public int IdAbono { get; set; }
        public int IdUsuarioCredito { get; set; }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime FechaAbono { get; set; }

        public float PrecioAbono { get; set; }
    }
}
