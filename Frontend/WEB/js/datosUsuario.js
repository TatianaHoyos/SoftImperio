
$(document).ready(function () {
    obtenerDatosUsuario();
   
});


function obtenerDatosUsuario(){
    var objetoRecuperado = JSON.parse(localStorage.getItem('miObjeto'));
   
    // Asignar texto al nombre de usuario usando .html()
$("#nombreUsuario").html("¡Hola! " + objetoRecuperado.nombre +" <span id='rolUsuario'></span>");

    var img= objetoRecuperado.foto.split("8080");
    // $("#imgUsuario").attr("src", "http://localhost:8080" + img[1]);
     $("#imgUsuario").attr("src", objetoRecuperado.foto);
    
     $("#rolUsuario").text(objetoRecuperado.rol.nombreRol);
     if (!objetoRecuperado.rol.permisos.hasOwnProperty('Configuracion')){
        $("#contenedorPrincipalNotificacion").remove();
      
        // Eliminar el elemento con ID "containerNotification"
        $("#containerNotification").remove();
     }     
   
}