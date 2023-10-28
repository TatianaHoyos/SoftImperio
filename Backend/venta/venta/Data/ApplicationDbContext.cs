using Microsoft.EntityFrameworkCore;
using venta.Models;
using venta.Model;
namespace venta.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        //// Define tus DbSet y relaciones aquí
        //public DbSet<Libro> Libros { get; set; }
        //public DbSet<Usuario> Usuarios { get; set; }
        //public DbSet<Préstamo> Préstamos { get; set; }
        //public DbSet<Libro> Libros { get; set; }
        //public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<UsuarioCredito> UsuarioCredito { get; set; }
        public DbSet<Venta> Ventas { get; set; }
        public DbSet<Compra> Compra { get; set; }
        public DbSet<DetalleCompra> DetalleCompra { get; set; }
        public DbSet<Existencia> Existencia { get; set; }
        public DbSet<Categoria> Categoria { get; set; }
        public DbSet<Productos> Productos { get; set; }

    }
}
