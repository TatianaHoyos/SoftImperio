using Microsoft.EntityFrameworkCore;
using venta.Models;

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
    public DbSet<Categoria> Categoria { get; set; }
    public DbSet<Productos> Productos { get; set; }

}
}
