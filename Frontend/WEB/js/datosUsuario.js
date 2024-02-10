
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
    
   
    if(objetoRecuperado.rol==1){
        $("#rolUsuario").text("Administrador");
          
    }else if(objetoRecuperado.rol==8){
        $("#rolUsuario").text("Mesero");
        $("#contenedorPrincipalNotificacion").remove();
       
        
    }
}