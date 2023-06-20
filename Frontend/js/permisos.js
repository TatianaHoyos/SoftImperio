$(document).ready(function () {
    $("#resultadoCrear").hide();
    $("#resultadoCrearConfig").hide();
    consultarRoles();
});

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
    console.log("consulta de roles");
    console.log(data);

    mostrarTablaRoles(data);
    mostrarListaRolesyPermisos(data);

}

function mostrarTablaRoles(data) {
    $('#tablaRol > tbody').empty();
    $.each(data, function(id, rol) {

        var boton1 = "<button onclick='EliminarRol("+ JSON.stringify(rol) +")' class='btn btn-delete' data-id='1'><i class='fas fa-trash'></i></button>";
        var boton2 = "<button onclick='EditarRol("+ JSON.stringify(rol) +")' class='btn btn-edit' data-toggle='modal' data-target='#modalRoles'><i class='fas fa-edit'></i></button>";
        var boton3 = "<button onclick='mostrarListaRolyPermisos("+ JSON.stringify(rol) +")' class='btn btn-edit' data-toggle='modal' data-target='#modalRolesYPermisos'><i class='fa-regular fa-key'></i></button>";

        $('#tablaRol').append('<tr><td>' + rol.nombreRol + '</td><td>' + rol.estado+
        '</td><td>' + boton3 + '</td><td>' + boton2 + '</td><td>' + boton1 + '</td></tr>');
        console.log(rol.id + ' ' + rol.nombreRol);

    });
}

 function mostrarListaRolesyPermisos(roles) {
      //clear the existing list
     $("#contentRoles .lista-Roles .card-header").remove();
     $("#contentRoles .lista-Roles .lista-permisos").remove();

     $.each(roles, function(index,rol) {

       $('#contentRoles .lista-Roles').append('<div class="card-header">'+rol.nombreRol +'</div>')
       $('#contentRoles .lista-Roles').append('<div class="card-body lista-permisos"><ul></ul></div>')

       $.each(rol.permisos, function(index,permiso) {
         $('#contentRoles .lista-Roles .lista-permisos ul').append('<li>'+permiso.nombrePermiso +' - '+permiso.modulo+'</li>')
     });
     });
}

function mostrarTablaRolYPermisos(data) {
    $('#tablaRolYPermisos > tbody > form').empty();
    $.each(data, function(id, rol) {

        var crear = "<input name='permiso' class='form-check-input' type='checkbox' id='permiso1' value='"+rol.nombreRol+"' "+estaElPermisoActivo(rol.permisos, "Crear")+">";
        var modificar = "<input name='permiso' class='form-check-input' type='checkbox' id='permiso1' value='"+rol.nombreRol+"' "+estaElPermisoActivo(rol.permisos, "Modificar")+">";
        var ver = "<input name='permiso' class='form-check-input' type='checkbox' id='permiso1' value='"+rol.nombreRol+"' "+estaElPermisoActivo(rol.permisos, "Ver")+">";
        var eliminar = "<input name='permiso' class='form-check-input' type='checkbox' id='permiso1' value='"+rol.nombreRol+"'  "+estaElPermisoActivo(rol.permisos, "Eliminar")+">";

        $('#tablaRolYPermisos >').append('<tr><td>' + crear + '</td><td>' + modificar+
        '</td><td>' + ver + '</td><td>' + eliminar + '</td></tr>');
    });
}

function estaElPermisoActivo(permisos, permiso){
    let result = permisos.find((item) => item === permiso);
    if (result == undefined) {
        return "checked";
    } else {
    return "";
    }
}

function onErrorRoles(error) {
    console.log(error)
}
function mostrarFormularioCrear(){
    var titulo = $("#tituloFomularioRol");
    titulo.text("Crear un nuevo rol");
    var btnform = $("#btn-form");
    btnform.text("Guardar");
    btnform.click(crearRol);
}
function mostrarFormularioActualizar(){
    var titulo = $("#tituloFomularioRol");
    titulo.text("Actualizar rol");
    var btnform = $("#btn-form");
    btnform.text("Actualizar");
   
}
function crearRol(){
    console.log("crear rol");
    var formData = {
       nombreRol:$("#nombreRol").val(),
       estado:$("#estado").val(),
    };
    console.log(JSON.stringify(formData))

    $.ajax({
     type: "POST",
     url:"http://localhost:8080/api/rol/crear",
     "headers": {
       "Content-Type": "application/json"
     },
     data: JSON.stringify(formData),
     success: onExitoCrearRol,
     error: onErrorCrearRol
});
}

function actualizarRol(idRol){
    console.log("actualizar rol");
    var formData = {
       nombreRol:$("#nombreRol").val(),
       estado:$("#estado").val(),
    };
    console.log(JSON.stringify(formData))

    $.ajax({
     type: "PUT",
     url:"http://localhost:8080/api/rol/actualizar"+idRol,
     "headers": {
       "Content-Type": "application/json"
     },
     data: JSON.stringify(formData),
     success: onExitoCrearRol,
     error: onErrorCrearRol
});
}


function onExitoCrearRol(data){
    console.log(data);
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-success");
    mensaje.removeClass("alert-danger");
    mensaje.show();
    mensaje.text(data.message);
    $("#formCrearRol").trigger("reset");
    consultarRoles();
}
function onErrorCrearRol(error){
    console.log(error);
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-danger");
    mensaje.removeClass("alert-success");
    mensaje.show();
    mensaje.text(error.message);
}


function EliminarRol(rol){
Swal.fire({
        title: '¿Estás seguro?',
        text: 'Desea eliminar el rol: '+ rol.nombreRol,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Realizar la solicitud de eliminación AJAX
            $.ajax({
                url: 'http://localhost:8080/api/rol/eliminar/'+rol.idRol,
                type: 'Delete',
                success: function(response) {
                    // Manejar la respuesta de eliminación exitosa
                    Swal.fire('Eliminado',response.message, 'success');
                    // Actualizar la tabla o realizar cualquier otra acción necesaria
                    consultarRoles();
                },
                error: function(xhr, status, error) {
                    // Manejar los errores de la solicitud AJAX
                    Swal.fire('Error', error.message, 'error');
                }
            });
        }
    });
}
function EditarRol(rol){
    mostrarFormularioActualizar();
    $("#estado option[value='"+ rol.estado +"']").attr("selected", true);
    $("#nombreRol").val(rol.nombreRol);
    var btnform = $("#btn-form");
    btnform.click(function(){ actualizarRol(rol.idRol); });
}

function guardarConfiguracion() {
    $("#resultadoCrearConfig").hide();
    console.log("guardar configuración");
    var form = $('#formGuardarConfiguracion')[0];
	// Create an FormData object
    var formData = new FormData(form);
    var permisos = [];
    var idRol = $("#idRol").val();
    for(var pair of formData.entries()){
       permisos.push(pair[1]);
     }

     var data = {
            idRol:idRol,//"1",//
            permisos: permisos
         };

    console.log(JSON.stringify(data));

    $.ajax({
         type: "PUT",
         url:"http://localhost:8080/api/configuracion/actualizar"+idRol,
         "headers": {
           "Content-Type": "application/json"
         },
         data: JSON.stringify(data),
         success: onExitoCrearConfiguracion,
         error: onErrorCrearConfiguracion
    });
}

function onExitoCrearConfiguracion(data){
    console.log(data);
    var mensaje = $("#resultadoCrearConfig");
    mensaje.addClass("alert-success");
    mensaje.removeClass("alert-danger");
    mensaje.show();
    mensaje.text(data.message);
    consultarRoles();
}
function onErrorCrearConfiguracion(error){
    console.log(error);
    var mensaje = $("#resultadoCrearConfig");
    mensaje.addClass("alert-danger");
    mensaje.removeClass("alert-success");
    mensaje.show();
    mensaje.text(error.message);
}

