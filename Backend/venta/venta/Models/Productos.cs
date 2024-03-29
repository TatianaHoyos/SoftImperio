﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace venta.Models
{
    [Table("productos")]
    public class Productos
    {
        [Key]
        public int IdProductos { get; set; }
        public int IdCategoria { get; set; }
        //public int IdProveedores { get; set; }
        public string NombreProducto { get; set; }
        public string ReferenciaProducto { get; set; }
        public string FotoProducto { get; set; }
        public float PrecioProducto { get; set; }

        [ForeignKey("IdCategoria")]
        public Categoria? Categoria { get; set; }

    }
}
