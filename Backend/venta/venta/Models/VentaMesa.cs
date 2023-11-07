using System.ComponentModel.DataAnnotations;

namespace venta.Models
{
    public class VentaMesa
    {
        [Key]
        public int idVentaMesas { get; set; }
        public int  idPedidoMesa { get; set; }  

        public int idExistencias { get; set; }
        public string CantidadProducto { get; set; }
        public float SubTotalAPagar { get; set; }
        public string EstadoConfirmarPedidoMesa { get; set; }


    }
}
