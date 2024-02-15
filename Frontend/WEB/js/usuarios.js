$(document).ready(function () {
    $("#resultadoCrear").hide();
    consultarUsuarios();
    consultarRoles();
    consultarRolesA();
    consultarRolesL();
    buscarUsuarioTabla();
    // $('#email').on('input', function () {
    //     validarEmailU();
    // });
});


function consultarUsuarios() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/usuarios/consultar",
        "headers": {
            "Content-Type": "application/json"
        },
        success: onExitoUsuarios,
        error: onErrorUsuarios
    });
}

function onErrorUsuarios(error) {
    console.log(error)
}
function onExitoUsuarios(data) {
    console.log("consulta de Usuarios");
    console.log(data);
    mostrarTablaUsuarios(data);
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



function mostrarTablaUsuarios(data) {
    $('#tablaUsuarios > tbody').empty();
    $.each(data, function (id, usuarios) {

        // Obtener el nombre del rol a través de una consulta AJAX
        $.ajax({
            url: 'http://localhost:8080/api/roles/' + usuarios.rol.idRol, // Ajusta la URL según la estructura de tu API
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
        // console.log(usuarios.idUsuarios + ' ' + rolData.nombreRol + ' ' + usuarios.nombre + ' ' + usuarios.documento
        //     + ' ' + usuarios.email + ' ' + usuarios.telefono + ' ' + usuarios.estado);
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


// function consultarRolesL() {
//     $.ajax({
//         type: "GET",
//         url: "http://localhost:8080/api/roles",
//         "headers": {
//             "Content-Type": "application/json"
//           },
//         success: onExitoRolesL,
//         error: onErrorRolesL
//     });
// }

// function onExitoRolesL(data) {
//     console.log(data);
//     var $dropdown = $("#idRol");
//     $.each(data, function () {
//         $dropdown.append($("<option />").val(this.idRol).text(this.nombreRol));
//     });
//     mostrarRolesConPermisos(data);
// }

// function mostrarRolesConPermisos(roles) {

//     // clear the existing list
//     $("#contentRoles .lista-Roles .card-header").remove();
//     $("#contentRoles .lista-Roles .lista-permisos").remove();

//     $.each(roles, function(index,rol) {
//       $('#contentRoles .lista-Roles').append('<div class="card-header">'+rol.nombreRol +'</div>')
//       $('#contentRoles .lista-Roles').append('<div class="card-body lista-permisos"><ul></ul></div>')

//       $.each(rol.permisos, function(index,permiso) {
//         $('#contentRoles .lista-Roles .lista-permisos ul').append('<li>'+permiso.nombrePermiso +" "+permiso.modulo+'</li>')
//     });
//     });

//   }

function onErrorRolesL(error) {
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
    // var nombre = $("#nombre").val();
    // var idRol = $("#idRol").val();
    // var documento = $("#documento").val();
    // var email = $("#email").val();
    // var telefono = $("#telefono").val();
    // var password = $("#password").val();
    // var foto = $("#fotos")[0].files[0];

    // // Validar el correo electrónico
    // if (!eEmailValido(email)) {
    //     Swal.fire({
    //         icon: 'error',
    //         title: 'Correo electrónico no válido',
    //         showConfirmButton: false,
    //         timer: 1700,
    //         customClass: {
    //             popup: 'tamanio-custom'
    //         }
    //     });
    //     return false; // Detener la creación del usuario si el correo no es válido
    // }

    // Validar el rol
    // if (!idRol) {
    //     Swal.fire({
    //         icon: 'warning',
    //         title: 'Seleccione un rol',
    //         showConfirmButton: false,
    //         timer: 1700,
    //         customClass: {
    //             popup: 'tamanio-custom'
    //         }
    //     });
    //     return false;
    // }

    // Crear el objeto FormData para la solicitud AJAX
    // var formData = {
    //     "nombre": nombre,
    //     "idRol": idRol,
    //     "documento": documento,
    //     "email": email,
    //     "telefono": telefono,
    //     "password": password,
    //     "foto": foto
    // };

    var form = $('#formCrearUsuario')[0];

	// Create an FormData object
    var formData = new FormData(form);

    console.log(formData)
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url:"http://localhost:8080/api/usuarios/crear",
        data: formData,
        processData: false,
        contentType: false,
        success: onExitoCrearUsuario,
        error: onErrorCrearUsuario
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

    // // Vaciar manualmente los campos del formulario después de 1.7 segundos
    // setTimeout(function () {
    //     $("#nombre").val('');

    //     // Establecer el campo idRol en el primer rol si hay roles disponibles
    //     var firstRoleId = obtenerPrimerRolId(); // función para obtener el ID del primer rol
    //     if (firstRoleId) {
    //         $("#idRol").val(firstRoleId);
    //     }

    //     $("#documento").val('');
    //     $("#email").val('');
    //     $("#telefono").val('');
    // }, 1700);

    // // Ocultar la modal después de 1.7 segundos
    // setTimeout(function () {
    //     $('#formCrearUsuarios').modal('hide');  // Utiliza el selector correcto
    //     consultarusuarios();
    // }, 1700);
}

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
    // mostrarRolesConPermisosA(data);
}

// function mostrarRolesConPermisosA(roles) {

//     // clear the existing list
//     $("#contentRoles .lista-Roles .card-header").remove();
//     $("#contentRoles .lista-Roles .lista-permisos").remove();
    
//     $.each(roles, function(index,rol) {
//       $('#contentRoles .lista-Roles').append('<div class="card-header">'+rol.nombreRol +'</div>')
//       $('#contentRoles .lista-Roles').append('<div class="card-body lista-permisos"><ul></ul></div>')
     
//       $.each(rol.permisos, function(index,permiso) {
//         $('#contentRoles .lista-Roles .lista-permisos ul').append('<li>'+permiso.nombrePermiso +" "+permiso.modulo+'</li>')
//     });
//     });
  
//   }

function onErrorRolesA(error) {
    console.log(error)
}



function mostrarFormularioActualizarCrearUsuarios() {
    var titulo = $("#tituloFormularioActualizarUsuarios");
    titulo.text("ACTUALIZAR UN USUARIO");
    var btnform = $("#btn-form");
    btnform.text("Actualizar");
}



function EditarUsuarios(usuarios){
    mostrarFormularioActualizarCrearUsuarios();
    $("#idRolActualizar option[value="+ usuarios.idRol +"]").attr("selected", true);
    $("#nombreActualizar").val(usuarios.nombre);
    $("#documentoActualizar").val(usuarios.documento );
    $("#emailActualizar").val(usuarios.email);
    $("#telefonoActualizar").val(usuarios.telefono );
    $("#estadoActualizar").val(usuarios.estado);
    var preview = document.getElementById("foto-previewActualizar");
    preview.src = "http://localhost:8080/"+usuarios.foto;
    preview.style.display = "block";
    var btnform = $("#btn-form");
    btnform.click(function(){ actualizarUsuarios(usuarios.idUsuarios); });
}

function actualizarUsuarios(idUsuarios){
    var form = $('#formActualizarUsuario')[0];

	// Create an FormData object 
    var formData = new FormData(form);

   console.log(formData);

   $.ajax({
    type: "Put",
    enctype: 'multipart/form-data',
    url:"http://localhost:8080/api/usuarios/actualizar/"+idUsuarios,
    data: formData,
    processData: false,
    contentType: false,
    success: onExitoCrearUsuario,
    error: onErrorCrearUsuario
});
}



function onExitoActualizarUsuario(data){
    console.log(data);
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-success");
    mensaje.removeClass("alert-danger");
    mensaje.show();
    mensaje.text(data.message);
    $("#formActualizarUsuarioA").trigger("reset");
    $("#foto-previewActualizar").attr('src', '');
}
function onErrorActualizarUsuario(error){
    console.log(error);
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-danger");
    mensaje.removeClass("alert-success");
    mensaje.show();
    mensaje.text(error.message);
}

// Asociar el envío del formulario fuera de cualquier función
// $(document).ready(function () {
//     $("#btn-form").click(function () {
//         actualizarUsuarios();
//     });
// });

// function onExitoActualizarUsuario(data) {
//     console.log(data);
//     var mensaje = $("#resultadoCrear");
//     mensaje.addClass("alert-success");
//     mensaje.removeClass("alert-danger");
//     mensaje.show();
//     mensaje.text(data.message);

//     // Mostrar la alerta de éxito con SweetAlert
//     Swal.fire({
//         icon: 'success',
//         title: 'Usuario actualizado exitosamente',
//         showConfirmButton: false,
//         timer: 1700,
//         customClass: {
//             popup: 'tamanio-custom'
//         }
//     });

//     // Vaciar manualmente los campos del formulario después de 1.7 segundos
//     // setTimeout(function () {
//     //     $("#idUsuario").val();
//     //     $("#nombreActualizar").val();
//     //     $("#idRolActualizar").val();
//     //     $("#documentoActualizar").val();
//     //     $("#emailActualizar").val();
//     //     $("#telefonoActualizar").val();
//     // }, 1700);

//     // Ocultar la modal después de 1.7 segundos
//     setTimeout(function () {
//         $('#formActualizarUsuarios').modal('hide');
//         consultarusuarios();
//     }, 1700);
// }

// function onErrorActualizarUsuario(error) {
//     console.log(error);
//     var mensaje = $("#resultadoCrear");
//     mensaje.addClass("alert-danger");
//     mensaje.removeClass("alert-success");
//     mensaje.show();
//     mensaje.text(error.message);
//     Swal.fire({
//         icon: 'warning',
//         title: 'Error al actualizar el usuario ',
//         text: 'Verifique si los campos estan llenos o correctos.',
//         showConfirmButton: false,
//         timer: 1700,
//         customClass: {
//             popup: 'tamanio-custom'
//         }
//     });
// }









// function actualizarUsuarios(idUsuarios){
//     var form = $('#formActualizarUsuarios')[0];

// 	// Create an FormData object
//     var formData = new FormData(form);

// console.log(formData);

// $.ajax({
//     type: "Put",
//     enctype: 'multipart/form-data',
//     url:"http://localhost:8080/api/usuarios/actualizar/"+idUsuarios,
//     data: formData,
//     processData: false,
//     contentType: false,
//     success: onExitoCrearUsuario,
//     error: onErrorCrearUsuario
// });
// }

// function onExitoCrearUsuario(data){
//     console.log(data);
//     var mensaje = $("#resultadoCrear");
//     mensaje.addClass("alert-success");
//     mensaje.removeClass("alert-danger");
//     mensaje.show();
//     mensaje.text(data.message);
//     $("#formCrearUsuario").trigger("reset");
//     $("#foto-preview").attr('src', '');
// }
// function onErrorCrearUsuario(error){
//     console.log(error);
//     var mensaje = $("#resultadoCrear");
//     mensaje.addClass("alert-danger");
//     mensaje.removeClass("alert-success");
//     mensaje.show();
//     mensaje.text(error.message);
// }
























// function buscarUsuarioTabla(){
//     $("#consultarTablaUsuario").keyup(function(){
//         _this = this;
//         // Show only matching TR, hide rest of them
//         $.each($("#tablaUsuarios tbody tr"), function() {
//         if($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)
//         $(this).hide();
//         else
//         $(this).show();
//         });
//         });
// }
// // function onExitoCrearUsuario(data){
// //     console.log(data);
// //     var mensaje = $("#resultadoCrear");
// //     mensaje.addClass("alert-success");
// //     mensaje.removeClass("alert-danger");
// //     mensaje.show();
// //     mensaje.text(data.message);
// //     $("#formCrearUsuario").trigger("reset");
// //     $("#foto-preview").attr('src', '');
// // }
// // function onErrorCrearUsuario(error){
// //     console.log(error);
// //     var mensaje = $("#resultadoCrear");
// //     mensaje.addClass("alert-danger");
// //     mensaje.removeClass("alert-success");
// //     mensaje.show();
// //     mensaje.text(error.message);
// // }



// function EliminarUsuario(usuarios){
//     Swal.fire({
//         title: '¿Estás seguro?',
//         text: 'Esta seguro de eliminar el usuario '+ usuarios.nombre,
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#d33',
//         cancelButtonColor: '#3085d6',
//         confirmButtonText: 'Eliminar',
//         cancelButtonText: 'Cancelar'
//     }).then((result) => {
//         if (result.isConfirmed) {
//             // Realizar la solicitud de eliminación AJAX
//             $.ajax({
//                 url: 'http://localhost:8080/api/usuarios/eliminar/'+usuarios.idUsuarios,
//                 type: 'Delete',
//                 success: function(response) {
//                     // Manejar la respuesta de eliminación exitosa
//                     Swal.fire('Eliminado',response.message, 'success');
//                     // Actualizar la tabla o realizar cualquier otra acción necesaria
//                     consultarUsuarios();
//                 },
//                 error: function(xhr, status, error) {
//                     // Manejar los errores de la solicitud AJAX
//                     Swal.fire('Error', error.message, 'error');
//                 }
//             });
//         }
//     });
// }


function EliminarUsuario(usuarios) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta seguro de eliminar el usuario '+ usuarios.nombre,
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
                url: 'http://localhost:8080/api/usuarios/eliminar/'+usuarios.idUsuarios,
                type: 'Delete',
                success: function (response) {
                    // Manejar la respuesta de eliminación exitosa
                    Swal.fire('Eliminado', response.message, 'success');
                    // Actualizar la tabla o realizar cualquier otra acción necesaria
                    handleAjaxRequest(consultarUsuarios);
                },
                error: function (xhr, status, error) {
                    // Manejar los errores de la solicitud AJAX
                    Swal.fire('Error', error.message, 'error');
                }
            });
        }
    });
}