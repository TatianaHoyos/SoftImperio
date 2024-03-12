document.addEventListener("DOMContentLoaded", function () {
  $(".sidebar").toggleClass("hidden");
  $(".navbar").toggleClass("menu-hidden");
  $("#logo-navbar").toggleClass("hidden");
  $("#logo-navbar").toggleClass("hidden", !$(".sidebar").hasClass("hidden"));

    // Obtener el elemento con el ID 'logo-navbar'
    var logoNavbar = $("#logo-navbar");
    // Verificar si tiene la clase 'd-block'
    if (logoNavbar.hasClass("d-block")) {
      // Si la tiene, aplicar la clase 'd-none' y quitar 'd-block'
      logoNavbar.removeClass("d-block").addClass("d-none");
    } else {
      // Si no la tiene, aplicar la clase 'd-block' y quitar 'd-none'
      logoNavbar.removeClass("d-none").addClass("d-block");
    }

});


$(document).ready(function () {

  $(".nav-link").click(function () {
    $(".nav-link").removeClass("active");
    // Añade la clase "active" solo al elemento clicado
    $(this).addClass("active");
   // Obtener el elemento con el ID 'logo-navbar'
  });
  
  // Ocultar/mostrar menú al hacer clic en el logo
  $("#logo, #logo-navbar").click(function () {

    $(".sidebar").toggleClass("hidden");
    $(".navbar").toggleClass("menu-hidden");
    $("#logo-navbar").toggleClass("hidden");
    $("#logo-navbar").toggleClass("hidden", !$(".sidebar").hasClass("hidden"));

      // Obtener el elemento con el ID 'logo-navbar'
      var logoNavbar = $("#logo-navbar");
      // Verificar si tiene la clase 'd-block'
      if (logoNavbar.hasClass("d-block")) {
        // Si la tiene, aplicar la clase 'd-none' y quitar 'd-block'
        logoNavbar.removeClass("d-block").addClass("d-none");
      } else {
        // Si no la tiene, aplicar la clase 'd-block' y quitar 'd-none'
        logoNavbar.removeClass("d-none").addClass("d-block");
      }
  });
  habilitarOpciones();
});

function habilitarOpciones(){
  var usuario = JSON.parse(localStorage.getItem('miObjeto'));
  if (!usuario.rol.permisos.hasOwnProperty('Configuracion')){
    $("#configuracion").remove();
    $("#ventaPuntos").remove();
    $("#configuracionInicio").remove();
  }
  if(!usuario.rol.permisos.hasOwnProperty('Credito')){
    $("#credito").remove();
}

if(!usuario.rol.permisos.hasOwnProperty('Venta')){
  $("#venta").remove();
  $("#ventaPuntos").remove();
  $("#ventaPuntosMesa").remove();
} else {
  if (usuario.rol.permisos.Venta.permisos.length == 2) {
  const permisosConsultar = usuario.rol.permisos.Venta.permisos.filter(permiso => permiso.nombrePermiso === "Consultar" && permiso.nombrePermiso === "Crear");
    if (permisosConsultar.length == 0) {
      $("#venta").remove();
      $("#ventaPuntos").remove();
    }
 }
}

if(!usuario.rol.permisos.hasOwnProperty('Compra')){
  $("#compras").remove();
}
if(!usuario.rol.permisos.hasOwnProperty('Proveedor')){
  $("#proveedores").remove();
}
if(!usuario.rol.permisos.hasOwnProperty('Usuario')){
  $("#usuarios").remove();
}
if(!usuario.rol.permisos.hasOwnProperty('Producto')){
  $("#productos").remove();
  $("#productosExistencias").remove();
}else {
  if (usuario.rol.permisos.Producto.permisos.length == 1 &&
     usuario.rol.permisos.Producto.permisos[0].nombrePermiso === "Consultar") {
      $("#productos").remove();
  }

}
}