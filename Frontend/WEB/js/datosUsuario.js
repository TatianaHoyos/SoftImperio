
$(document).ready(function () {
    obtenerDatosUsuario();
   
});


function obtenerDatosUsuario(){
    var objetoRecuperado = JSON.parse(localStorage.getItem('miObjeto'));
   
    // Asignar texto al nombre de usuario usando .html()
$("#nombreUsuario").html("¡Hola! " + objetoRecuperado.nombre +" <span id='rolUsuario'></span>");

     $("#imgUsuario").attr("src", hostDomainImage+"/" + objetoRecuperado.foto);
    
     $("#rolUsuario").text(objetoRecuperado.rol.nombreRol);
     if (!objetoRecuperado.rol.permisos.hasOwnProperty('Configuracion')){
        $("#contenedorPrincipalNotificacion").remove();
      
        // Eliminar el elemento con ID "containerNotification"
        $("#containerNotification").remove();
     }     
   
}