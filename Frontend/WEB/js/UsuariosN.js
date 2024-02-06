$(document).ready(function () {
    $("#resultadoCrear").hide();
    consultarusuarios();
    consultarRoles();
    consultarRolesA();
    consultarRolesList();
    buscarUsuarioTabla();
});

function consultarusuarios() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/usuarios/consultar",
        headers: {
            "Content-Type": "application/json"
        },
        success: onExitousuarios,
        error: onErrorusuarios
    });
}

function onErrorusuarios(error) {
    console.log(error);
}


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
}

function onErrorRoles(error) {
    console.log(error)
}


function onExitousuarios(data) {
    console.log("consulta de usuarios");
    console.log(data);

    $('#tablaUsuarios > tbody').empty();

    // Iterar sobre los datos de usuarios
    $.each(data, function (id, usuarios) {

        // Obtener el nombre del rol a través de una consulta AJAX
        $.ajax({
            url: 'http://localhost:8080/api/roles/' + usuarios.idRol, // Ajusta la URL según la estructura de tu API
            type: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
            success: function (rolData) {
                // Construir los botones
                var boton1 = "<button onclick='EliminarUsuario(" + JSON.stringify(usuarios) + ")' class='btn btn-delete' data-id='1'><i class='fas fa-trash'></i></button>";
                var boton2 = "<button onclick='EditarUsuarios(" + JSON.stringify(usuarios) + ")' class='btn btn-edit' data-toggle='modal' data-target='#formActualizarUsuarios'><i class='fas fa-edit'></i></button>";

                // Agregar una fila a la tabla con el nombre del rol en lugar del ID
        $('#tablaUsuarios').append('<tr><td>' + usuarios.idUsuarios +'</td><td>' + rolData.nombreRol +'</td><td>' + usuarios.nombre +
            '</td><td>' + usuarios.documento + '</td><td>' + usuarios.email +'</td><td>' + usuarios.telefono + '</td><td>' + usuarios.estado +
            '</td><td>' + boton2 + '</td><td>' + boton1 + '</td></tr>');
        console.log(usuarios.idUsuarios + ' ' + rolData.nombre + ' ' + usuarios.nombre + ' ' + usuarios.documento 
            + ' ' + usuarios.email + ' ' + usuarios.telefono + ' ' + usuarios.estado);
            },
            error: function (error) {
                console.error("Error al obtener el nombre del rol: ", error);
            }
        });
    });
}


function buscarUsuarioTabla(){
    $("#consultarTablaUsuarios").keyup(function(){
        _this = this;
        // Show only matching TR, hide rest of them
        $.each($("#tablaUsuarios tbody tr"), function() {
        if($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)
        $(this).hide();
        else
        $(this).show();
        });
        });
}






function consultarRolesList() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/roles",
        "headers": {
            "Content-Type": "application/json"
          },
        success: onExitoRolesList,
        error: onErrorRolesList
    });
}

function onExitoRolesList(data) {
    console.log(data);
    var $dropdown = $("#idRol");

    // Limpiar las opciones existentes
    $dropdown.empty();

    // Agregar las opciones de roles desde la respuesta del servidor
    $.each(data, function () {
        $dropdown.append($("<option />").val(this.idRol).text(this.nombreRol));
    });

    // Seleccionar automáticamente el primer rol si hay roles disponibles
    if (data.length > 0) {
        $("#idRol").val(data[0].idRol);
    }

    // Mostrar los roles con permisos
    mostrarRolesConPermisos(data);
}

function mostrarRolesConPermisos(roles) {

    // clear the existing list
    $("#contentRoles .lista-Roles .card-header").remove();
    $("#contentRoles .lista-Roles .lista-permisos").remove();
    
    $.each(roles, function(index,rol) {
      $('#contentRoles .lista-Roles').append('<div class="card-header">'+rol.nombreRol +'</div>')
      $('#contentRoles .lista-Roles').append('<div class="card-body lista-permisos"><ul></ul></div>')
     
      $.each(rol.permisos, function(index,permiso) {
        $('#contentRoles .lista-Roles .lista-permisos ul').append('<li>'+permiso.nombrePermiso +" "+permiso.modulo+'</li>')
    });
    });
  
  }

function onErrorRolesList(error) {
    console.log(error)
}

function mostrarFormularioCrearUsuarios() {
    var titulo = $("#tituloFormularioUsuarios");
    titulo.text("CREAR UN NUEVO USUARIO");
}
const eEmailValido = (email) => {
    return email.match(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    );
  };
  
  $(document).ready(function () {
    // Otro código...

    // Vincula la función validarEmailU al evento input del campo de correo electrónico
    $('#email').on('input', function () {
        validarEmailU();
    });

    // Otro código...
});

function validarEmailU() {
    const emailMensaje = $('#emailMensaje');
    const email = $('#email').val();
    emailMensaje.text('');
    if (email.length === 0) {
        // Si el campo de correo electrónico está vacío, no se muestra ningún mensaje
        return;
    }
    if (eEmailValido(email)) {
        emailMensaje.text('correo valido');
        emailMensaje.css('color', 'green');
    } else {
        emailMensaje.text('el correo no es valido');
        emailMensaje.css('color', 'red');
    }
}
function crearUsuarios() {
    // Obtener valores del formulario
    var nombre = $("#nombre").val();
    var idRol = $("#idRol").val();
    var documento = $("#documento").val();
    var email = $("#email").val();
    var telefono = $("#telefono").val();
    var password = $("#documento").val();  // ¿Es correcto usar el documento como contraseña?
    var estado = "activo";
    var foto="null";

    // Validar campos vacíos
    if (validarCampoVacio(nombre.length, 'Por favor ingrese un nombre')) {
        return false;
    }
    if (validarCampoVacio(documento.length, 'Por favor ingrese documento')) {
        return false;
    }
    if (validarCampoVacio(email.length, 'Por favor ingrese email')) {
        return false;
    }
    if (validarCampoVacio(telefono.length, 'Por favor ingrese telefono')) {
        return false;
    }

    // Validar el correo electrónico
    if (!eEmailValido(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Correo electrónico no válido',
            showConfirmButton: false,
            timer: 1700,
            customClass: {
                popup: 'tamanio-custom'
            }
        });
        return false; // Detener la creación del usuario si el correo no es válido
    }

    // Validar el rol
    if (idRol === null) {
        Swal.fire({
            icon: 'warning',
            title: 'Seleccione un rol',
            showConfirmButton: false,
            timer: 1700,
            customClass: {
                popup: 'tamanio-custom'
            }
        });
        return false;
    }

    // Crear el objeto FormData para la solicitud AJAX
    var formData = {
        "nombre": nombre,
        "idRol": idRol,
        "documento": documento,
        "email": email,
        "telefono": telefono,
        "password": password,
        "estado": estado,
        "foto": foto

    };
    console.log(formData)
    // Realizar la solicitud AJAX
    $.ajax({
        type: "POST",
        url: "http://localhost:8080/api/usuarios/crear",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        data: JSON.stringify(formData),
        success: onExitoCrearUsuario,
        error: function(jqXHR, textStatus, errorThrown) {
            console.log("Error en la solicitud AJAX:", textStatus, errorThrown);
            console.log(jqXHR.responseText);
            // Agrega más detalles sobre el manejo del error según sea necesario
            onErrorCrearUsuario(jqXHR.responseJSON);
        }        
    });
}



function onExitoCrearUsuario(data) {
    console.log(data);
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-success");
    mensaje.removeClass("alert-danger");
    mensaje.show();
    mensaje.text(data.message);

    // Mostrar la alerta de éxito con SweetAlert
    Swal.fire({
        icon: 'success',
        title: 'Usuario guardado exitosamente',
        showConfirmButton: false,
        timer: 1700,
        customClass: {
            popup: 'tamanio-custom'
        }
    });

    // Vaciar manualmente los campos del formulario después de 1.7 segundos
    setTimeout(function () {
        $("#nombre").val('');

        // Establecer el campo idRol en el primer rol si hay roles disponibles
        var firstRoleId = obtenerPrimerRolId(); // función para obtener el ID del primer rol
        if (firstRoleId) {
            $("#idRol").val(firstRoleId);
        }

        $("#documento").val('');
        $("#email").val('');
        $("#telefono").val('');
    }, 1700);

    // Ocultar la modal después de 1.7 segundos
    setTimeout(function () {
        $('#formCrearUsuarios').modal('hide');  // Utiliza el selector correcto
        consultarusuarios();
    }, 1700);
}

// Función para obtener el ID del primer rol
function obtenerPrimerRolId() {
    // Aquí puedes utilizar la lógica para obtener el ID del primer rol
    // Puedes usar la misma lógica que usamos en onExitoRolesList
    var firstRoleId = $("#idRol option:first").val();
    return firstRoleId;
}


function onErrorCrearUsuario(error) {
    console.log(error);
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-danger");
    mensaje.removeClass("alert-success");
    mensaje.show();
    mensaje.text(error.message);
    Swal.fire({
        icon: 'warning',
        title: 'Error al agregar el usuario ',
        showConfirmButton: false,
        timer: 1700,
        customClass: {
            popup: 'tamanio-custom'
        }
    });
}






function EliminarUsuario(usuarios) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Estás seguro de eliminar el usuario ' + usuarios.nombre + '?',
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
                url: 'https://localhost:7084/api/Usuarios/' + usuarios.idUsuarios,
                type: 'DELETE',
                success: function (response) {
                    // Mostrar un mensaje de éxito predeterminado
                    Swal.fire({
                        icon: 'success',
                        title: 'Eliminado',
                        text: 'Usuario eliminado correctamente',
                        showConfirmButton: false,
                        timer: 1700,
                        customClass: {
                            popup: 'tamanio-custom'
                        }
                    });
                    // Actualizar la tabla o realizar cualquier otra acción necesaria
                    consultarusuarios();
                },
                error: function (xhr, status, error) {
                    // Manejar los errores de la solicitud AJAX
                    Swal.fire('Error', error.message, 'error');
                }
            });
        }
    });
}





function consultarRolesA() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/roles",
        "headers": {
            "Content-Type": "application/json"
          },
        success: onExitoRolesA,
        error: onErrorRoles
    });
}

function onExitoRolesA(data) {
    console.log(data);
    var $dropdown = $("#idRolActualizar");
    $.each(data, function () {
        $dropdown.append($("<option />").val(this.idRol).text(this.nombreRol));
    });
    mostrarRolesConPermisosA(data);
}

function mostrarRolesConPermisosA(roles) {

    // clear the existing list
    $("#contentRoles .lista-Roles .card-header").remove();
    $("#contentRoles .lista-Roles .lista-permisos").remove();
    
    $.each(roles, function(index,rol) {
      $('#contentRoles .lista-Roles').append('<div class="card-header">'+rol.nombreRol +'</div>')
      $('#contentRoles .lista-Roles').append('<div class="card-body lista-permisos"><ul></ul></div>')
     
      $.each(rol.permisos, function(index,permiso) {
        $('#contentRoles .lista-Roles .lista-permisos ul').append('<li>'+permiso.nombrePermiso +" "+permiso.modulo+'</li>')
    });
    });
  
  }

function onErrorRolesA(error) {
    console.log(error)
}

function mostrarFormularioActualizarCrearUsuarios() {
    var titulo = $("#tituloFormularioActualizarUsuarios");
    titulo.text("ACTUALIZAR UN USUARIO");
}

function EditarUsuarios(usuarios) {
    mostrarFormularioActualizarCrearUsuarios();

    // Llenar los campos del formulario con la información del usuario
    $("#idUsuarios").val(usuarios.idUsuarios);
    $("#nombreActualizar").val(usuarios.nombre);
    $("#idRolActualizar").val(usuarios.idRol);
    $("#documentoActualizar").val(usuarios.documento);
    $("#emailActualizar").val(usuarios.email);
    $("#telefonoActualizar").val(usuarios.telefono);
    $("#estadoActualizar").val(usuarios.estado);
}

function actualizarUsuarios() {
    var form = $('#formActualizarUsuarios')[0];
    var formData =  JSON.stringify({
        "idUsuarios":  $("#idUsuarios").val(), // Cambiado a "idUsuario"
        "nombre": $("#nombreActualizar").val(),
        "idRol": $("#idRolActualizar").val(),
        "documento": $("#documentoActualizar").val(),
        "email": $("#emailActualizar").val(),
        "telefono": $("#telefonoActualizar").val(),
        "password": $("#documentoActualizar").val(),
        "estado":  $("#estadoActualizar").val(),
    });
    console.log(formData);
    if (formData.idRol === null) {
        Swal.fire({
            icon: 'warning',
            title: 'Seleccione un rol',
            showConfirmButton: false,
            timer: 1700,
            customClass: {
                popup: 'tamanio-custom'
            }
        });
        return false;
    }
    // Validar el campo estado
    if (formData.estado === null) {
        Swal.fire({
            icon: 'warning',
            title: 'Seleccione un estado',
            showConfirmButton: false,
            timer: 1700,
            customClass: {
                popup: 'tamanio-custom'
            }
        });
        return false;
    }
    if (validarCampoVacio($("#nombreActualizar").val().length ,'Por favor ingrese un nombre')) {
        return false;
    }
    if (validarCampoVacio($("#documentoActualizar").val().length ,'Por favor ingrese documento')) {
        return false;
    }
    if (validarCampoVacio($("#emailActualizar").val().length ,'Por favor ingrese email')) {
        return false;
    }
    if (validarCampoVacio($("#telefonoActualizar").val().length ,'Por favor ingrese telefono')) {
        return false;
    }

    $.ajax({
        type: "put",
        url: "https://localhost:7084/api/Usuarios/" + $("#idUsuarios").val(), // Cambiado a "idUsuario"
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json"
        },
        data: formData,
        success: onExitoActualizarUsuario,
        error: onErrorActualizarUsuario
    });
}


// Asociar el envío del formulario fuera de cualquier función
$(document).ready(function () {
    $("#btn-form").click(function () {
        actualizarUsuarios();
    });
});

function onExitoActualizarUsuario(data) {
    console.log(data);
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-success");
    mensaje.removeClass("alert-danger");
    mensaje.show();
    mensaje.text(data.message);

    // Mostrar la alerta de éxito con SweetAlert
    Swal.fire({
        icon: 'success',
        title: 'Usuario actualizado exitosamente',
        showConfirmButton: false,
        timer: 1700,
        customClass: {
            popup: 'tamanio-custom'
        }
    });

    // Vaciar manualmente los campos del formulario después de 1.7 segundos
    setTimeout(function () {
        $("#idUsuario").val();
        $("#nombreActualizar").val();
        $("#idRolActualizar").val();
        $("#documentoActualizar").val();
        $("#emailActualizar").val();
        $("#telefonoActualizar").val();
    }, 1700);

    // Ocultar la modal después de 1.7 segundos
    setTimeout(function () {
        $('#formActualizarUsuarios').modal('hide');
        consultarusuarios();
    }, 1700);
}

function onErrorActualizarUsuario(error) {
    console.log(error);
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-danger");
    mensaje.removeClass("alert-success");
    mensaje.show();
    mensaje.text(error.message);
    Swal.fire({
        icon: 'warning',
        title: 'Error al actualizar el usuario ',
        text: 'Verifique si los campos estan llenos o correctos.',
        showConfirmButton: false,
        timer: 1700,
        customClass: {
            popup: 'tamanio-custom'
        }
    });
}



// function crearUsuarios() {
//     var email = $("#email").val();  // Obtener el valor del correo electrónico

//     // Validar el correo electrónico
//     if (!eEmailValido(email)) {
//         Swal.fire({
//             icon: 'error',
//             title: 'Correo electrónico no válido',
//             showConfirmButton: false,
//             timer: 1700,
//             customClass: {
//                 popup: 'tamanio-custom'
//             }
//         });
//         return false; // Detener la creación del usuario si el correo no es válido
//     }

//     var formData = {
//         "nombre": $("#nombre").val(),
//         "idRol": $("#idRol").val(),  // Asegúrate de que coincida con el nombre en el formulario
//         "documento": $("#documento").val(),
//         "email": email, 
//         "telefono": $("#telefono").val(),
//         "password": $("#documento").val(),
//         "estado": "activo"
//     };

//     console.log(formData);

//     if (formData.idRol === null) {
//         Swal.fire({
//             icon: 'warning',
//             title: 'Seleccione un rol',
//             showConfirmButton: false,
//             timer: 1700,
//             customClass: {
//                 popup: 'tamanio-custom'
//             }
//         });
//     }
//     if (validarCampoVacio($("#nombre").val().length ,'Por favor ingrese un nombre')) {
//         return false;
//     }
//     if (validarCampoVacio($("#documento").val().length ,'Por favor ingrese documento')) {
//         return false;
//     }
//     if (validarCampoVacio($("#email").val().length ,'Por favor ingrese email')) {
//         return false;
//     }
//     if (validarCampoVacio($("#telefono").val().length ,'Por favor ingrese telefono')) {
//         return false;
//     }


//     $.ajax({
//         type: "POST",
//         url: "https://localhost:7084/api/Usuarios",
//         headers: {
//             "Accept": "application/json",
//             "Content-Type": "application/json"
//         },
//         data: JSON.stringify(formData),
//         success: onExitoCrearUsuario,
//         error: function(jqXHR, textStatus, errorThrown) {
//             console.log("Error en la solicitud AJAX:", textStatus, errorThrown);
//             console.log(jqXHR.responseText); // Esto imprimirá la respuesta del servidor en la consola.
//             onErrorCrearUsuario(jqXHR.responseJSON);
//         }
//     });
// }
