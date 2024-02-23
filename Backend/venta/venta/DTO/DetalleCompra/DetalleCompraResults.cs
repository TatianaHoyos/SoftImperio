using System.ComponentModel.DataAnnotations;

namespace venta.DTO.DetalleCompra
{
    public class DetalleCompraResults
    {
        [Key]
        public int IdDetalleCompra { get; set; }
        public int IdCompra { get; set; }
        public string Proveedor { get; set; }
        public string Producto { get; set; }
        public decimal Precio { get; set; }
        public string Categoria { get; set; }
        public int IdCategoria { get; set; }
        public int CantidadProducto { get; set; }
        public decimal Subtotal { get; set; }
        public int IdExistencias { get; set; }
        public int IdProveedor { get; set; }


    }

}
