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
        public DbSet<DetalleCreditos> DetalleCreditos { get; set; }
        public DbSet<Creditos> Creditos { get; set; }
        public DbSet<UsuarioCredito> UsuarioCredito { get; set; }
        public DbSet<Venta> Venta { get; set; }
        public DbSet<Compra> Compras { get; set; }
        public DbSet<DetalleCompra> DetalleCompra { get; set; }
        public DbSet<Existencia> Existencia { get; set; }
        public DbSet<Categoria> Categoria { get; set; }
        public DbSet<Productos> Productos { get; set; }
        public DbSet<DetalleVenta> DetalleVenta { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configurar el valor predeterminado de la propiedad TuCampoTimestamp en la entidad Venta
            modelBuilder.Entity<Venta>()
                .Property(e => e.fechaVenta)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            // Otros ajustes de configuración si los tienes

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<venta.Models.Usuarios>? Usuarios { get; set; }

    }
}
