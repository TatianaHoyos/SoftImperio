using System.ComponentModel.DataAnnotations;

namespace venta.Models
{
    public class Usuarios
    {
        [Key]

        public int IdUsuarios { get; set; }
        public int IdRol { get; set; }
        public string Nombre { get; set; }
        public string Documento { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string Password { get; set; }
        public string Estado { get; set; }


    }
}
