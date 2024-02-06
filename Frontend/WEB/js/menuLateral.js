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
  console.log("clickeando2");

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
});
