namespace venta.DTO
{
    public class Referencia
    {
        public int IdProducto { get;set; }
        public string NombreReferencia { get; set; }
        public float Precio { get; set; }
        public ExistenciaDto Existencia { get; set; }
    }
}
