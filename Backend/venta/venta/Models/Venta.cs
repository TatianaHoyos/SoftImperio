using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace venta.Models
{
    [Table("venta")]
    public class Venta
    {
        [Key]
        public int idVenta { get; set; }
       
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public DateTime fechaVenta { get; set; }

        public float totalVenta { get; set; }
        public string estado { get; set; }
        public string origen { get; set; }

    }
}
