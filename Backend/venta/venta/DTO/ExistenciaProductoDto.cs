namespace venta.Dto
{
    public class ExistenciaProductoDto
    {
        public int IdProducto { get; set; }
        public string NombreProducto { get; set; }
        public string FotoProducto { get; set; }
        public string ReferenciaProducto { get; set; }
        public int IdExistencia { get; set; }
        public int? Stock { get; set; }

    }
}
