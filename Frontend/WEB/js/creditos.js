$(document).ready(function () {
    $("#resultadoCrear").hide();
    handleAjaxRequest(consultarcreditos);
    buscarUsuarioCreditoTabla();
});

function consultarcreditos(token) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8081/edge-service/v1/service/creditos/consultar",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        success: onExitocreditos,
        error: onErrorcreditos
    });
}

function onErrorcreditos(error) {
    // console.log(error);
    Swal.fire({
        title: 'Error',
        text: error.responseJSON.value.message,
        icon:"warning",
        showCancelButton: false,
        confirmButtonColor: ' #d5c429 ',
        confirmButtonText: 'Confirmar',
    }).then((result) => {
       
    });
}

function onExitocreditos(data) {
   // console.log("Consulta de Créditos");
    //console.log(data);

    // $('#tablaCreditos > tbody').empty();

    if ($.fn.DataTable.isDataTable('#tablaCreditos')) {
        $('#tablaCreditos').DataTable().destroy();
    }
        // Obtén una referencia a la DataTable
        var dataTable = $('#tablaCreditos').DataTable({
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
    
        // Recorre los datos y agrega las filas
        $.each(data, function (id, credito) {
            
    
            var boton1 = "<button onclick='EliminarProducto(" + JSON.stringify(productos) + ")' class='btn btn-eliminar' data-id='1'><i class='fas fa-trash'></i></button>";
            var boton2 = "<button onclick='EditarProducto(" + JSON.stringify(productos) + ")' class='btn btn-editar' data-toggle='modal' data-target='#formCrearProductos'><i class='fas fa-edit'></i></button>";
    
            // Agrega la fila a la DataTable
            dataTable.row.add([
                nombreCategoria,
                productos.nombreProducto,
                productos.referenciaProducto,
                productos.existencia.cantidad,
                productos.precioProducto,
                boton1 +
                boton2
            ]).draw();
    
            // console.log(productos.id + ' ' + productos.nombreProducto + ' ' + productos.idCategoria + ' ' +
            //     productos.referenciaProducto + ' ' + productos.precioProducto);
        });



    $.each(data, function (id, creditos) {
        if (creditos.idUsuarioCredito ===null) {
            // Si idUsuarioCredito es null, obtén los detalles del usuario directamente desde el endpoint /api/usuarios
            handleAjaxRequest(function (token) {
                callApiExitoCredito(creditos,token);
            });
        } else {
            // Si idUsuarioCredito no es null, obtén los detalles del usuario desde el endpoint /api/UsuarioCreditos
            handleAjaxRequest(function (token) {
                callApiExitoCreditoUsuarioCreditos(creditos,token);
            });
        }
    });
}
function callApiExitoCreditoUsuarioCreditos(creditos,token){
    $.ajax({
        type: "GET",
        url: "http://localhost:8081/edge-service/v1/service/usuario/credito/consultar/id/" + creditos.idUsuarioCredito,
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        success: function (userData) {
            agregarFilaATabla(userData, creditos);
        },
        error: function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error inesperado',
                showConfirmButton: false,
                timer: 2700
            });
        }
    });
}
function callApiExitoCreditoUsuario(creditos,token){
    $.ajax({
        type: "GET",
        url: "http://localhost:8081/edge-service/v1/service/usuario/consultar" + creditos.idUsuarios,
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        success: function (userData) {
            agregarFilaATabla(userData, creditos);
        },
        error: function (error) {
            //console.log(error);
            Swal.fire({
                title: 'Error',
                text: error.responseJSON.value.message,
                icon:"warning",
                showCancelButton: false,
                confirmButtonColor: ' #d5c429 ',
                confirmButtonText: 'Confirmar',
            }).then((result) => {
               
            });
        }
    });
}
function agregarFilaATabla(userData, creditos) {
    var boton1 = "<button onclick='handleButtonClick(" + JSON.stringify(creditos) + ")' class='btn btn-warning' data-toggle='modal' data-target='#formActualizarUsuarios'></button>";
    var boton2 = "<button onclick='" + JSON.stringify(creditos) + "' class='btn btn-warning' data-toggle='modal' data-target='#formActualizarUsuarios'><i class='bi bi-currency-dollar'></i></button>";

    // Agregar fila a la tabla con los detalles del usuario
    $('#tablaCreditos').append('<tr><td>' + userData.nombre + '</td><td>' + userData.telefono +
        '</td><td>' + creditos.idVenta + '</td><td>' + creditos.precioCredito + '</td><td>' + creditos.fechaCredito + '</td><td>' + boton1 + '</td><td>' + boton2 + '</td></tr>');
}

// Asegúrate de que la función handleButtonClick esté definida en otra parte de tu código.

function actualizarUsuarioCredito() {
    var form = $('#formUsuarioCredito')[0];
    var formData =  JSON.stringify({
        "idUsuarioCredito":  $("#idUsuarioCredito").val(),
        "nombre": $("#nombre").val(),
        "documento": $("#documento").val(),
        "telefono":  $("#telefono").val()
      });
    //console.log(formData);
    handleAjaxRequest(function (token) {
        callApiactualizarUsuarioCredito(formData,token);
    });
}
function callApiactualizarUsuarioCredito(formData,token){
    $.ajax({
        type: "Put",
        enctype: 'multipart/form-data',
        url: "http://localhost:8081/edge-service/v1/service/usuario/credito/actualizar/id/" + $("#idUsuarioCredito").val(),
        "headers": {
            "accept": "application/json",
            "Content-Type": "application/json"
          }, // Asegúrate de que la URL sea correcta
        data: formData,
        processData: false,
        success: onExitoCrearUsuariocredito,
        error: onErrorusuariocreditocrear
    });
}

function EliminarUsuarioCredito(usuariocredito) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Estás seguro de eliminar el usuario crédito ' + usuariocredito.nombre + '?',
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
                callApiDeleteUsuarioCredito(token,usuariocredito);
            });
        }
    });
}
function callApiDeleteUsuarioCredito(token,usuariocredito){
    $.ajax({
        url: 'http://localhost:8081/edge-service/v1/service/usuario/credito/eliminar/id/' + usuariocredito.idUsuarioCredito,
        "headers": {
            'Authorization': `Bearer ${token}`
          },
        type: 'DELETE',
        success: function (response) {
            // Mostrar un mensaje de éxito predeterminado
            Swal.fire('Eliminado', 'Usuario crédito eliminado correctamente', 'success');
            // Actualizar la tabla o realizar cualquier otra acción necesaria
            consultarusuariocredito();
        },
        error: function (xhr, status, error) {
            // Manejar los errores de la solicitud AJAX
            Swal.fire('Error', error.message, 'error');
        }
    });
}
function buscarUsuarioCreditoTabla() {
    $("#consultarTablaUsuarioCredito").keyup(function () {
        _this = this;
        // Show only matching TR, hide rest of them
        $.each($("#tablaUsuarioCredito tbody tr"), function () {
            if ($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)
                $(this).hide();
            else
                $(this).show();
        });
    });
}
