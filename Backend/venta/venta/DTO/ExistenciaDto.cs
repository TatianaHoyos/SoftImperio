namespace venta.DTO
{
    public class ExistenciaDto
    {
        public int IdExistencias { get; set; }
        public int IdProductos { get; set; }
        public int? Stock { get; set; }
        public int Cantidad { get; set; }
        public string Estado { get; set; }
    }
}
