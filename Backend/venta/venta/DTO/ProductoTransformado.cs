namespace venta.DTO
{
    public class ProductoTransformado
    {
        public string NombreProducto { get; set; }
        public string Foto { get; set; }
        public List<Referencia> Referencias { get; set; }
    }
}
