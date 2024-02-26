$(document).ready(function () {
    $("#resultadoCrear").hide();
    $("#resultadoCrearConfig").hide();
    handleAjaxRequest(consultarRoles);
    handleAjaxRequest(consultarPermiso);
 
});

function consultarRoles(token) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8081/edge-service/v1/service/roles/consultar",
        "headers": {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
        success: onExitoRoles,
        error: onErrorRoles
    });
}

function onExitoRoles(data) {
   // mostrarTablaRoles(data);
    mostrarListaRolesyPermisos(data);
}


function mostrarListaRolesyPermisos(roles) {
    // Crear la estructura básica de la tabla
    var tablaPrincipal = $('<table>').attr('id', 'tablaPrincipal').addClass('table w-100');
    var thead = $('<thead>').appendTo(tablaPrincipal);
    var tbody = $('<tbody>').appendTo(tablaPrincipal);

    // Agregar encabezados
    var encabezados = $('<tr>').appendTo(thead);
    $('<th>').text('ID Rol').appendTo(encabezados);
    $('<th>').text('Nombre Rol').appendTo(encabezados);
    $('<th>').text('Módulo').appendTo(encabezados);
    $('<th>').text('Permisos').appendTo(encabezados);
    $('<th>').text('Acciones').appendTo(encabezados);

    roles.forEach(function (rol) {
        var boton1 = "<button onclick='EliminarRol("+ JSON.stringify(rol) +")' class='btn btn-delete' data-id='1'><i class='fas fa-trash'></i></button>";
        var boton2 = "<button onclick='EditarRol("+ JSON.stringify(rol) +")' class='btn btn-edit' data-toggle='modal' data-target='#modalRoles'><i class='fas fa-edit'></i></button>";
        var boton3 = "<button onclick='mostrarListaRolyPermisos("+ JSON.stringify(rol) +")' class='btn btn-edit' data-toggle='modal' data-target='#modalRolesYPermisos'><i class='fas fa-wrench'></i></button>";

        var fila = $('<tr>').appendTo(tbody);
        $('<td>').text(rol.idRol).appendTo(fila);
        $('<td>').text(rol.nombreRol).appendTo(fila);

        // Agrupar por módulo
        var permisosPorModulo = {};
        rol.permisos.forEach(function (permiso) {
            if (!permisosPorModulo[permiso.modulo.nombre]) {
                permisosPorModulo[permiso.modulo.nombre] = [];
            }
            permisosPorModulo[permiso.modulo.nombre].push(permiso.acciones.nombre);
        });

        // Añadir celdas para módulo y permisos
        var modulos = Object.keys(permisosPorModulo);
        var moduloCell = $('<td>').appendTo(fila);
        var permisosCell = $('<td>').appendTo(fila);

        if (modulos.length > 0) {
            //moduloCell.text(modulos.join('\n'));
            modulos.forEach(function (modulo) {
                permisosCell.append($('<p>').html( permisosPorModulo[modulo].join(', ')));
                moduloCell.append($('<p>').html( modulo ));
            });
        }

        // Añadir celda vacía si no hay módulos o permisos
        else {
            moduloCell.text('');
            permisosCell.text('');
        }

        // Añadir botones a la columna de acciones
        var accionesCell = $('<td>').appendTo(fila);
        var boton1 = $("<button>").addClass('btn btn-delete').attr('data-id', '1').html('<i class="fas fa-trash"></i>').click(function () {
            EliminarRol(rol);
        });
        var boton2 = $("<button>").addClass('btn btn-edit').attr('data-toggle', 'modal').attr('data-target', '#modalRoles').html('<i class="fas fa-edit"></i>').click(function () {
            EditarRol(rol);
        });
        var boton3 = $("<button>").addClass('btn btn-edit').attr('data-toggle', 'modal').attr('data-target', '#modalRolesYPermisos').html('<i class="fas fa-wrench"></i>').click(function () {
            mostrarListaRolyPermisos(rol);
        });

        accionesCell.append(boton3, boton2, boton1);
    });

    // Insertar la tabla en el contenedor
    $('#tabla').empty().append(tablaPrincipal);

    // Inicializar DataTables después de agregar la tabla
    $('#tablaPrincipal').DataTable({
        dom: '<"row"<"col-md-6"l><"col-md-6"f>>tip',
        pageLength: 5,
        lengthMenu: [5, 10, 25, 50], 
       
        language: {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        }
    });
}




function mostrarListaRolyPermisos(data) {
    $("#resultadoCrearConfig").hide();
    $('#tablaRolYPermisos > tbody').empty();
    var nuevoData = agruparPorModulo(data.permisos);
$("#idRol").val(data.idRol);
$("#nombreRolTitulo").text(data.nombreRol);
//Pintamos los permisos con la info consultada en la tabla permiso
    $.each(permisosCache, function(id, permiso) {
       var nombreModulo=permiso.nombreModulo;
        $('#tablaRolYPermisos > tbody').append('<tr id="'+nombreModulo+'-tr"></tr>');

       var fila= "<td>" + permiso.nombreModulo + "</td>";
       var crear = "<input name='permiso' class='form-check-input' type='checkbox' id='"+nombreModulo+"-crear'>";
       var modificar = "<input name='permiso' class='form-check-input' type='checkbox' id='"+nombreModulo+"-editar' >";
       var ver = "<input name='permiso' class='form-check-input' type='checkbox' id='"+nombreModulo+"-consultar' >";
       var eliminar = "<input name='permiso' class='form-check-input' type='checkbox' id='"+nombreModulo+"-eliminar' >";


        fila=fila + "<td  style='text-align: center;'>" + crear+ "</td>"+"<td style='text-align: center;' >" + modificar+ "</td>"+"<td style='text-align: center;'>" + ver+ "</td>"+"<td style='text-align: center;'>" + eliminar+ "</td>";
        $('#'+nombreModulo+'-tr').append(fila);

        $.each(permiso.permisos, function(id, permiso) {
            var id =nombreModulo+"-"+permiso.nombrePermiso.toLowerCase();
            var $checkbox= $('#'+id);
            $checkbox.attr('value', permiso.idPermisos);

            //estaElPermisoActivo(permiso.nombrePermiso.toLowerCase(),
             //permiso.nombrePermiso.toLowerCase(),
             //$checkbox);
        });
    });
//Verificamos si están activos (asociados al rol)
    $.each(nuevoData, function(id, permiso) {
        var nombreModulo=permiso.nombreModulo;
       $.each(permiso.permisos, function(id, permiso) {
           var id =nombreModulo+"-"+permiso.nombrePermiso.toLowerCase();
           var $checkbox= $('#'+id);

            estaElPermisoActivo(permiso.nombrePermiso.toLowerCase(),
            permiso.nombrePermiso.toLowerCase(),
            $checkbox);
       });
    });
 }
 
 function agruparPorModulo(permisos) {
    var resultado = {};
    
    permisos.forEach(function(permiso) {
      var modulo = permiso.modulo.nombre;
      
      if (!resultado.hasOwnProperty(modulo)) {
        resultado[modulo] = {
          nombreModulo: modulo,
          permisos: []
        };
      }
      
      resultado[modulo].permisos.push({
        idPermisos: permiso.idPermisos,
        nombrePermiso: permiso.acciones.nombre
      });
    });
    
    // return Object.values(resultado);
    return resultado;
  }

function estaElPermisoActivo(permisos, permiso, checkbox){
    if (permisos == permiso) {
        checkbox.prop('checked', true);
    }
}

function onErrorRoles(error) {
    Swal.fire({
        title: 'Error',
        text: error.responseJSON.message,
        icon:"warning",
        showCancelButton: false,
        confirmButtonColor: ' #d5c429 ',
        confirmButtonText: 'Confirmar',
    }).then((result) => {
       
    });
}
function mostrarFormularioCrear(){
    var titulo = $("#tituloFomularioRol");
    titulo.text("Crear un nuevo rol");
    var btnform = $("#btn-form");
    btnform.text("Guardar");
   //btnform.click(crearRol);
   $("#operacionRol").val("crearRol");
   $("#idRolActualizar").val("");
  // btnform.click(function(){ crearRol(); });
}
function mostrarFormularioActualizar(){
    var titulo = $("#tituloFomularioRol");
    titulo.text("Actualizar rol");
    var btnform = $("#btn-form");
    btnform.text("Actualizar");
   
}
function eventoFormularioRol(){
    var operacion=$("#operacionRol").val();
    if(operacion=="crearRol"){
        crearRol();
    }else if(operacion=="actualizarRol"){
        var idRol=$("#idRolActualizar").val();
        actualizarRol(idRol);
    }
}
function crearRol(){
    var formData = {
       nombreRol:$("#nombreRol").val(),
       estado:$("#estado").val(),
    };
    handleAjaxRequest(function (token) {
        callApiCrearRol(formData, token);
    });

}

function callApiCrearRol(formData,token){

    $.ajax({
        type: "POST",
        url:"http://localhost:8081/edge-service/v1/service/roles/crear",
        "headers": {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(formData),
        success: onExitoCrearRol,
        error: onErrorCrearRol
   });
}

function actualizarRol(idRol){
    var formData = {
       nombreRol:$("#nombreRol").val(),
       estado:$("#estado").val(),
    };

    handleAjaxRequest(function (token) {
        callApiActualizarRol(idRol, formData, token);
    });

}

function callApiActualizarRol(idRol, formData, token){
    $.ajax({
        type: "PUT",
        url:"http://localhost:8081/edge-service/v1/service/roles/actualizar/"+idRol,
        "headers": {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(formData),
        success: onExitoCrearRol,
        error: onErrorCrearRol
   });
}


function onExitoCrearRol(data){
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-success");
    mensaje.removeClass("alert-danger");
    mensaje.show();
    mensaje.text(data.message);
    $("#formCrearRol").trigger("reset");
   handleAjaxRequest(consultarRoles);
}
function onErrorCrearRol(error){
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
            handleAjaxRequest(function (token) {
                callApiEliminar(rol.idRol, token);
            });
        }
    });
}

function callApiEliminar(idRol,token){
    $.ajax({
        url: 'http://localhost:8081/edge-service/v1/service/roles/eliminar/'+ idRol,
        type: 'Delete',
        "headers": {
            'Authorization': `Bearer ${token}`
          },
        success: function(response) {
            // Manejar la respuesta de eliminación exitosa
            Swal.fire('Eliminado',response.message, 'success');
            // Actualizar la tabla o realizar cualquier otra acción necesaria
            handleAjaxRequest(consultarRoles);
        },
        error: function(xhr, status, error) {
            // Manejar los errores de la solicitud AJAX
            Swal.fire('Error', error.message, 'error');
        }
    });
}

function EditarRol(rol){
    mostrarFormularioActualizar();
    $("#estado option[value="+ rol.estado +"]").attr("selected", true);
    $("#nombreRol").val(rol.nombreRol);
    $("#operacionRol").val("actualizarRol");
    $("#idRolActualizar").val(rol.idRol);
    // var btnform = $("#btn-form");
    // btnform.click(function(){ actualizarRol(rol.idRol); });
}

function guardarConfiguracion() {
    $("#resultadoCrearConfig").hide();
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

    handleAjaxRequest(function (token) {
        callApiGuardarConfiguracion(data, token);
    });
   
}
function callApiGuardarConfiguracion(data,token){
    $.ajax({
        type: "POST",
        url:"http://localhost:8081/edge-service/v1/service/roles/configuracion/crear",
        "headers": {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(data),
        success: onExitoCrearConfiguracion,
        error: onErrorCrearConfiguracion
   });
}

function onExitoCrearConfiguracion(data){
    var mensaje = $("#resultadoCrearConfig");
    mensaje.addClass("alert-success");
    mensaje.removeClass("alert-danger");
    mensaje.show();
    mensaje.text(data.message);
   handleAjaxRequest(consultarRoles);
}
function onErrorCrearConfiguracion(error){
    var mensaje = $("#resultadoCrearConfig");
    mensaje.addClass("alert-danger");
    mensaje.removeClass("alert-success");
    mensaje.show();
    mensaje.text(error.message);
}

function consultarPermiso(token) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8081/edge-service/v1/service/permisos/consultar",
        "headers": {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
        success: onExitoPermisos,
        error: onErrorPermisos
    });
}

var permisosCache = {};
function onExitoPermisos(data) {
    permisosCache = agruparPorModulo(data);

}

function onErrorPermisos(error) {
    Swal.fire({
        title: 'Error',
        text: error.responseJSON.message,
        icon:"warning",
        showCancelButton: false,
        confirmButtonColor: ' #d5c429 ',
        confirmButtonText: 'Confirmar',
    }).then((result) => {
       
    });
}




function downloadBackup() {
    $.get("http://localhost:8080/api/backup/download", function(response) {
        alert(response);
    });
}