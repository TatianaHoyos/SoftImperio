$(document).ready(function () {
    $("#resultadoCrear").hide();
    consultarcreditos();
    buscarUsuarioCreditoTabla();
});

// function mostrarFormularioActualizarCrearUsuarioCreditos() {
//     var titulo = $("#tituloFormularioUsuarioCredito");
//     titulo.text("Actualizar un usuario crédito");
//     var btnform = $("#btn-form");
//     btnform.text("Actualizar");
//     btnform.off("click").click(function () {
//         var idUsuarioCredito = $("#idUsuarioCredito").val();
//         actualizarUsuarioCredito(idUsuarioCredito);
//     });
// }

// function mostrarFormularioCrearUsuarioCreditos() {
//     var titulo = $("#tituloFormularioUsuarioCredito");
//     titulo.text("Crear un nuevo usuario crédito");
//     var btnform = $("#btn-form");
//     btnform.text("Guardar");
//     btnform.off("click").click(crearUsuarioCredito);
// }



// function crearUsuarioCredito() {
//     var form = $('#formUsuarioCredito')[0];
//     var formData =  JSON.stringify({
//         "nombre": $("#nombre").val(),
//         "documento": $("#documento").val(),
//         "telefono":  $("#telefono").val()
//       });

      
//      console.log(formData);

//     $.ajax({
//         type: "POST",
//         url: "https://localhost:7084/api/UsuarioCreditos",
//         "headers": {
//             "accept": "application/json",
//             "Content-Type": "application/json"
//           },
//         data: formData,
//         processData: false, 
//         success: onExitoCrearUsuariocredito,
//         error: onErrorusuariocreditocrear
//     });
// }


// function onExitoCrearUsuariocredito(data) {
//     console.log(data);
//     var mensaje = $("#resultadoCrear");
//     mensaje.addClass("alert-success");
//     mensaje.removeClass("alert-danger");
//     mensaje.show();
//     mensaje.text(data.message);
//     $("#formUsuarioCredito").trigger("reset");
//     consultarusuariocredito();
// }

// function onErrorusuariocreditocrear(error) {
//     console.log(error);
//     var mensaje = $("#resultadoCrear");
//     mensaje.addClass("alert-danger");
//     mensaje.removeClass("alert-success");
//     mensaje.show();
//     mensaje.text(error.message);
// }

function consultarcreditos() {
    $.ajax({
        type: "GET",
        url: "https://localhost:7084/api/Creditos",
        headers: {
            "Content-Type": "application/json"
        },
        success: onExitocreditos,
        error: onErrorcreditos
    });
}

function onErrorcreditos(error) {
    console.log(error);
}

function onExitocreditos(data) {
    console.log("Consulta de Créditos");
    console.log(data);

    $('#tablaCreditos > tbody').empty();

    $.each(data, function (id, creditos) {
        if (creditos.idUsuarioCredito ===null) {
            // Si idUsuarioCredito es null, obtén los detalles del usuario directamente desde el endpoint /api/usuarios
            $.ajax({
                type: "GET",
                url: "http://localhost:8080/api/usuarios/consultar/" + creditos.idUsuarios,
                headers: {
                    "Content-Type": "application/json"
                },
                success: function (userData) {
                    agregarFilaATabla(userData, creditos);
                },
                error: function (error) {
                    console.log(error);
                }
            });
        } else {
            // Si idUsuarioCredito no es null, obtén los detalles del usuario desde el endpoint /api/UsuarioCreditos
            $.ajax({
                type: "GET",
                url: "https://localhost:7084/api/UsuarioCreditos/" + creditos.idUsuarioCredito,
                headers: {
                    "Content-Type": "application/json"
                },
                success: function (userData) {
                    agregarFilaATabla(userData, creditos);
                },
                error: function (error) {
                    console.log(error);
                }
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













// function onExitocreditos(data) {
//     console.log("consulta de Creditos");
//     console.log(data);

//     $('#tablaCreditos > tbody').empty();
//     $.each(data, function (id, creditos) {

//         // Fetch user details based on idUsuarioCredito
//         $.ajax({
//             type: "GET",
//             url: "https://localhost:7084/api/UsuarioCreditos/" + creditos.idUsuarioCredito,
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             success: function (userData) {
//                 var boton1 = "<button onclick='("+ JSON.stringify(creditos) +")' class='btn btn-warning' data-toggle='modal' data-target='#formActualizarUsuarios'></button>";
//                 var boton2 = "<button onclick='" + JSON.stringify(creditos) + "' class='btn btn-warning' data-toggle='modal' data-target='#formActualizarUsuarios'><i class='bi bi-currency-dollar'></i></button>";


//                 // Append row to the table with user details
//                 $('#tablaCreditos').append('<tr><td>' + userData.nombre + '</td><td>' + userData.telefono +
//                     '</td><td>' + creditos.idVenta + '</td><td>' + creditos.precioCredito + '</td><td>' + creditos.fechaCredito + '</td><td>' + boton1 + '</td><td>' + boton2+ '</td></tr>');
//             },
//             error: function (error) {
//                 console.log(error);
//             }
//         });
//     });
// }

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
