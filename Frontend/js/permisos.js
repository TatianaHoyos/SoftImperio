$(document).ready(function () {
    // $("#resultadoCrear").hide();
    consultarRoles();
});
// function consultarRoles() {
//     $.ajax({
//         type: "GET",
//         url: "http://localhost:8080/api/roles",
//         "headers": {
//             "Content-Type": "application/json"
//           },
//         success: onExitoRoles,
//         error: onErrorRoles
//     });
// }
// function onErrorRoles(error) {
//     console.log(error)
// }
// function onExitoRoles(roles) {

//     // clear the existing list
//     $("#contentRoles .lista-Roles .card-header").remove();
//     $("#contentRoles .lista-Roles .lista-permisos").remove();

//     $.each(roles, function(index,rol) {
        
//       $('#contentRoles .lista-Roles').append('<div class="card-header">'+rol.nombreRol +'</div>')
//       $('#contentRoles .lista-Roles').append('<div class="card-body lista-permisos"><ul></ul></div>')

//       $.each(rol.permisos, function(index,permiso) {
//         $('#contentRoles .lista-Roles .lista-permisos ul').append('<li>'+permiso.nombrePermiso +' - '+permiso.modulo+'</li>')
//     });
//     });

//   }
  function consultarRoles() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/roles",
        "headers": {
            "Content-Type": "application/json"
          },
        success: onExitoRoles,
        error: onErrorRoles
    });
}

function onExitoRoles(data) {
    console.log(data);
   
$('#tablaRol > tbody').empty();
$.each(data, function(id, rol) {
    //alert('Estoy recorriendo el registro numero: ' + idx);
   
    var boton1 = "<button onclick='EliminarRol("+ JSON.stringify(rol) +")' class='btn btn-delete' data-id='1'><i class='fas fa-trash'></i></button>";
    var boton2 = "<button onclick='EditarRol("+ JSON.stringify(rol) +")' class='btn btn-edit' data-toggle='modal' data-target='#formCrearRoles'><i class='fas fa-edit'></i></button>";

    $('#tablaRol').append('<tr><td>' + rol.nombreRol + '</td><td>' + rol.estado+   
    '</td><td>' + boton1 + '</td><td>' + boton2 + '</td></tr>');
    console.log(rol.id + ' ' + rol.nombreRol);
     
});
    

}
function onErrorRoles(error) {
    console.log(error)
}
function mostrarFormularioCrear(){
    var titulo = $("#tituloFomularioRol");
    titulo.text("Crear un nuevo productos");
    var btnform = $("#btn-form");
    btnform.text("Guardar");
    btnform.click(crearRol);
}
function mostrarFormularioActualizar(){
    var titulo = $("#tituloFomularioRol");
    titulo.text("Actualizar un producto");
    var btnform = $("#btn-form");
    btnform.text("Actualizar");
   
}
function crearRol(){
    console.log("crear rol")
}
function EliminarRol(rol){

}
function EditarRol(rol){

}
