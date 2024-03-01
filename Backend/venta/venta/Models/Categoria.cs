using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace venta.Models
{
    [Table("categoria")]
    public class Categoria
    {
        [Key]
        public int IdCategoria { get; set; }
        public string NombreCategoria { get; set; }
    }
}
