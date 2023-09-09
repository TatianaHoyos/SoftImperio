using System.ComponentModel.DataAnnotations;

namespace venta.Models
{
    public class Categoria
    {
        [Key]
        public int IdCategoria { get; set; }
        public string NombreCategoria { get; set; }
    }
}
