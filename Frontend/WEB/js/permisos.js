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
    console.log("consulta de roles");
    console.log(data);

    mostrarTablaRoles(data);
    mostrarListaRolesyPermisos(data);
}

function mostrarTablaRoles(data) {
    // Destruir la DataTable existente si ya ha sido inicializada
if ($.fn.DataTable.isDataTable('#tablaRol')) {
    $('#tablaRol').DataTable().destroy();
}
    // Obtén una referencia a la DataTable
    var dataTable = $('#tablaRol').DataTable({
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
    
    // Limpia la tabla
    dataTable.clear();

   // $('#tablaRol > tbody').empty();
    $.each(data, function(id, rol) {

        var boton1 = "<button onclick='EliminarRol("+ JSON.stringify(rol) +")' class='btn btn-delete' data-id='1'><i class='fas fa-trash'></i></button>";
        var boton2 = "<button onclick='EditarRol("+ JSON.stringify(rol) +")' class='btn btn-edit' data-toggle='modal' data-target='#modalRoles'><i class='fas fa-edit'></i></button>";
        var boton3 = "<button onclick='mostrarListaRolyPermisos("+ JSON.stringify(rol) +")' class='btn btn-edit' data-toggle='modal' data-target='#modalRolesYPermisos'><i class='fas fa-wrench'></i></button>";

        // $('#tablaRol').append('<tr><td>' + rol.nombreRol + '</td><td>' + rol.estado+
        // '</td><td>' + boton3 + '</td><td>' + boton2 + '</td><td>' + boton1 + '</td></tr>');
        // //console.log(rol.id + ' ' + rol.nombreRol);

         // Agrega la fila a la DataTable
         dataTable.row.add([
            rol.nombreRol,
            rol.estado,
            boton3 +
            boton2 +
            boton1
        ]).draw();

    });
}

function mostrarListaRolesyPermisos(roles) {
    var tablaPrincipal = '<table id="tablaPrincipal" class="table w-100"><thead><tr><th>ID Rol</th><th>Nombre Rol</th><th>Módulo</th><th>Permisos</th></tr></thead><tbody>';

    roles.forEach(function (rol) {
        tablaPrincipal += '<tr><td>' + rol.idRol + '</td><td>' + rol.nombreRol + '</td>';

        // Agrupar por módulo
        var permisosPorModulo = {};
        rol.permisos.forEach(function (permiso) {
            if (!permisosPorModulo[permiso.modulo]) {
                permisosPorModulo[permiso.modulo] = [];
            }
            permisosPorModulo[permiso.modulo].push(permiso.nombrePermiso);
        });

        // Generar celdas para módulo y permisos
        var modulos = Object.keys(permisosPorModulo);
        if (modulos.length > 0) {
            tablaPrincipal += '<td>' + modulos.join('<br>') + '</td>';
            tablaPrincipal += '<td>';
            modulos.forEach(function (modulo) {
                tablaPrincipal += '<p><strong>' + modulo + ':</strong> ' + permisosPorModulo[modulo].join(', ') + '</p>';
            });
            tablaPrincipal += '</td>';
        } else {
            // Agregar celdas vacías si no hay módulos o permisos
            tablaPrincipal += '<td></td><td></td>';
        }

        tablaPrincipal += '</tr>';
    });

    tablaPrincipal += '</tbody></table>';
    $('#tabla').html(tablaPrincipal);

    // Inicializar DataTables después de agregar la tabla
    $('#tablaPrincipal').DataTable();
}



function mostrarListaRolyPermisos(data) {
    $("#resultadoCrearConfig").hide();
    $('#tablaRolYPermisos > tbody').empty();
    console.log(JSON.stringify(data))
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
       var ver = "<input name='permiso' class='form-check-input' type='checkbox' id='"+nombreModulo+"-ver' >";
       var eliminar = "<input name='permiso' class='form-check-input' type='checkbox' id='"+nombreModulo+"-eliminar' >";

        fila=fila + "<td>" + crear+ "</td>"+"<td>" + modificar+ "</td>"+"<td>" + ver+ "</td>"+"<td>" + eliminar+ "</td>";
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
      var modulo = permiso.modulo;
      
      if (!resultado.hasOwnProperty(modulo)) {
        resultado[modulo] = {
          nombreModulo: modulo,
          permisos: []
        };
      }
      
      resultado[modulo].permisos.push({
        idPermisos: permiso.idPermisos,
        nombrePermiso: permiso.nombrePermiso
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
    console.log(error)
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
    console.log("crear rol");
    var formData = {
       nombreRol:$("#nombreRol").val(),
       estado:$("#estado").val(),
    };
    console.log(JSON.stringify(formData))
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
    console.log("actualizar rol");
    var formData = {
       nombreRol:$("#nombreRol").val(),
       estado:$("#estado").val(),
    };
    console.log(JSON.stringify(formData))

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
    console.log(data);
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-success");
    mensaje.removeClass("alert-danger");
    mensaje.show();
    mensaje.text(data.message);
    $("#formCrearRol").trigger("reset");
   handleAjaxRequest(consultarRoles);
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
    console.log(data);
    var mensaje = $("#resultadoCrearConfig");
    mensaje.addClass("alert-success");
    mensaje.removeClass("alert-danger");
    mensaje.show();
    mensaje.text(data.message);
   handleAjaxRequest(consultarRoles);
}
function onErrorCrearConfiguracion(error){
    console.log(error);
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
    console.log("consulta de permisos");
    console.log(data);
    permisosCache = agruparPorModulo(data);

}

function onErrorPermisos(error) {
    console.log("consulta de permisos");
    console.log(error);

}




function downloadBackup() {
    $.get("http://localhost:8080/api/backup/download", function(response) {
        alert(response);
    });
}