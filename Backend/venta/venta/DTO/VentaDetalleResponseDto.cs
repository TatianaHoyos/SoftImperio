namespace venta.DTO
{
    public class VentaDetalleResponseDto
    {
        public string NombreProducto { get; set; }
        public string ReferenciaProducto { get; set; }
        public float SubTotalAPagar { get; set; }
        public int IdProductos { get; set; }
        public int CantidadProducto { get; set; }
        public float TotalVenta { get; set; }
    }
}
