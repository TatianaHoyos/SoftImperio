namespace venta.Dto
{
    public class DetalleCompraListarDto
    {
        public int IdDetalleCompra { get; set; }
        public int? IdCompra { get; set; }
        public string Categoria { get; set; }
        public string NombreProducto { get; set; }
        public string ReferenciaProducto { get; set; }
        public int? CantidadProductos { get; set; }
        public double PrecioProducto { get; set; }
        public double SubTotal { get; set; }
        public int IdExistencia { get; set; }
    }
}
