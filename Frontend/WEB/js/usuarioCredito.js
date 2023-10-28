$(document).ready(function () {
    $("#resultadoCrear").hide();
    consultarusuariocredito();
    buscarUsuarioCreditoTabla();
});

function mostrarFormularioActualizarCrearUsuarioCreditos() {
    var titulo = $("#tituloFormularioUsuarioCredito");
    titulo.text("Actualizar un usuario crédito");
    var btnform = $("#btn-form");
    btnform.text("Actualizar");
    btnform.off("click").click(function () {
        var idUsuarioCredito = $("#idUsuarioCredito").val();
        actualizarUsuarioCredito(idUsuarioCredito);
    });
}

function mostrarFormularioCrearUsuarioCreditos() {
    var titulo = $("#tituloFormularioUsuarioCredito");
    titulo.text("Crear un nuevo usuario crédito");
    var btnform = $("#btn-form");
    btnform.text("Guardar");
    btnform.off("click").click(crearUsuarioCredito);
}



function crearUsuarioCredito() {
    var form = $('#formUsuarioCredito')[0];
    var formData =  JSON.stringify({
        "nombre": $("#nombre").val(),
        "documento": $("#documento").val(),
        "telefono":  $("#telefono").val()
      });

      
     console.log(formData);

    $.ajax({
        type: "POST",
        url: "https://localhost:7084/api/UsuarioCreditos",
        "headers": {
            "accept": "application/json",
            "Content-Type": "application/json"
          },
        data: formData,
        processData: false, 
        success: onExitoCrearUsuariocredito,
        error: onErrorusuariocreditocrear
    });
}


function onExitoCrearUsuariocredito(data) {
    console.log(data);
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-success");
    mensaje.removeClass("alert-danger");
    mensaje.show();
    mensaje.text(data.message);
    $("#formUsuarioCredito").trigger("reset");
    consultarusuariocredito();
}

function onErrorusuariocreditocrear(error) {
    console.log(error);
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-danger");
    mensaje.removeClass("alert-success");
    mensaje.show();
    mensaje.text(error.message);
}

function consultarusuariocredito() {
    $.ajax({
        type: "GET",
        url: "https://localhost:7084/api/UsuarioCreditos",
        headers: {
            "Content-Type": "application/json"
        },
        success: onExitousuariocredito,
        error: onErrorusuariocredito
    });
}

function onErrorusuariocredito(error) {
    console.log(error);
}

function onExitousuariocredito(data) {
    console.log("consulta de Usuarios Creditos");
    console.log(data);

    $('#tablaUsuarioCredito > tbody').empty();
    $.each(data, function (id, usuariocredito) {

        var boton1 = "<button onclick='EliminarUsuarioCredito(" + JSON.stringify(usuariocredito) + ")' class='btn btn-delete' data-id='1'><i class='fas fa-trash'></i></button>";
        var boton2 = "<button onclick='EditarUsuarioCredito(" + JSON.stringify(usuariocredito) + ")' class='btn btn-edit' data-toggle='modal' data-target='#formCrearUsuarioCredito'><i class='fas fa-edit'></i></button>";

        $('#tablaUsuarioCredito').append('<tr><td>' + usuariocredito.nombre +
            '</td><td>' + usuariocredito.documento + '</td><td>' + usuariocredito.telefono + '</td><td>' + boton2 + '</td><td>' + boton1 + '</td></tr>');
        console.log(usuariocredito.nombre + ' ' + usuariocredito.documento
            + ' ' + usuariocredito.telefono);

    });
}

function EditarUsuarioCredito(usuariocredito) {
    mostrarFormularioActualizarCrearUsuarioCreditos();
    $("#idUsuarioCredito").val(usuariocredito.idUsuarioCredito);
    $("#nombre").val(usuariocredito.nombre);
    $("#documento").val(usuariocredito.documento);
    $("#telefono").val(usuariocredito.telefono);
    var btnform = $("#btn-form");
    btnform.click(function(){ actualizarUsuarioCredito(); });
}

function actualizarUsuarioCredito() {
    var form = $('#formUsuarioCredito')[0];
    var formData =  JSON.stringify({
        "idUsuarioCredito":  $("#idUsuarioCredito").val(),
        "nombre": $("#nombre").val(),
        "documento": $("#documento").val(),
        "telefono":  $("#telefono").val()
      });
    console.log(formData);
    $.ajax({
        type: "Put",
        enctype: 'multipart/form-data',
        url: "https://localhost:7084/api/UsuarioCreditos/" + $("#idUsuarioCredito").val(),
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
            $.ajax({
                url: 'https://localhost:7084/api/UsuarioCreditos/' + usuariocredito.idUsuarioCredito,
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
