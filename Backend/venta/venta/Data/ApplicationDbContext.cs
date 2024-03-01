using Microsoft.EntityFrameworkCore;
using venta.Models;
using venta.Model;
using venta.DTO.DetalleCompra;
using venta.DTO.Productos;

namespace venta.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)

        {
        }
        public DbSet<DetalleCreditos> DetalleCreditos { get; set; }
        public DbSet<UsuarioCredito> UsuarioCredito { get; set; }
        public DbSet<Venta> Venta { get; set; }
        public DbSet<Compra> Compras { get; set; }
        public DbSet<DetalleCompra> DetalleCompra { get; set; }
        public DbSet<Existencia> Existencia { get; set; }
        public DbSet<Categoria> Categoria { get; set; }
        public DbSet<Productos> Productos { get; set; }
        public DbSet<DetalleVenta> DetalleVenta { get; set; }
        public DbSet<Creditos> creditos { get; set; }
        public DbSet<AbonoCredito> AbonoCreditos { get; set; }

        public DbSet<DetalleCompraResults> DetalleCompraResult { get; set; }
        public DbSet<ProductosExistenciaSPResult> ProductosExistenciaSPResult { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configurar el valor predeterminado de la propiedad TuCampoTimestamp en la entidad Venta
            modelBuilder.Entity<Venta>()
                .Property(e => e.fechaVenta)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            modelBuilder.Entity<Creditos>()
                .Property(e => e.Fecha)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");
            // Otros ajustes de configuración si los tienes
            modelBuilder.Entity<AbonoCredito>()
                .Property(e => e.FechaAbono)
                .HasDefaultValueSql("CURRENT_TIMESTAMP");

            base.OnModelCreating(modelBuilder);
        }

    }
}
