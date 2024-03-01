$(document).ready(function () {
    $("#resultadoCrear").hide();
    consultarUsuarios();
    consultarRoles();
    consultarRolesL();
    buscarUsuarioTabla();
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

// function onExitoUsuarios(data) {
//     console.log("consulta de Usuarios");
//     console.log(data);
//     mostrarTablaUsuarios(data);

// }

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

// function mostrarTablaUsuarios(data) {
//     $('#tablaUsuarios > tbody').empty();
//     $.each(data, function (id, usuarios) {

//         // Obtener el nombre del rol a través de una consulta AJAX
//         $.ajax({
//             url: 'http://localhost:8080/api/roles/' + usuarios.rol.idRol, // Ajusta la URL según la estructura de tu API
//             type: 'GET',
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             success: function (rolData) {
//                 // Construir los botones
//                 var boton1 = "<button onclick='EliminarUsuario(" + JSON.stringify(usuarios) + ")' class='btn btn-delete' data-id='1'><i class='fas fa-trash'></i></button>";
//                 var boton2 = "<button onclick='EditarUsuario(" + JSON.stringify(usuarios) + ")' class='btn btn-edit' data-toggle='modal' data-target='#formActualizarUsuarios'><i class='fas fa-edit'></i></button>";

//                 // Agregar una fila a la tabla con el nombre del rol en lugar del ID
//                 $('#tablaUsuarios').append('<tr><td>' + usuarios.idUsuarios +'</td><td>' + rolData.nombreRol +'</td><td>' + usuarios.nombre +
//                     '</td><td>' + usuarios.documento + '</td><td>' + usuarios.email +'</td><td>' + usuarios.telefono + '</td><td>' + usuarios.estado +
//                     '</td><td>' + boton2 + '</td><td>' + boton1 + '</td></tr>');
//                 console.log(usuarios.idUsuarios + ' ' + rolData.nombreRol + ' ' + usuarios.nombre + ' ' + usuarios.documento
//                 + ' ' + usuarios.email + ' ' + usuarios.telefono + ' ' + usuarios.estado);
//             },
//             error: function (error) {
//                 console.error("Error al obtener el nombre del rol: ", error);
//             }
//         });
//     });
// }

function onExitoUsuarios(data) {
    console.log(data);


    if ($.fn.DataTable.isDataTable('#tablaUsuarios')) {
        $('#tablaUsuarios').DataTable().destroy();
    }
    // Obtén una referencia a la DataTable
    var dataTable = $('#tablaUsuarios').DataTable({
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
            },
        },
        lengthMenu: [5, 10, 25, 50],
        pageLength: 5, // Número de registros por página
    });
    // Limpia la tabla
    dataTable.clear();
    $.each(data, function (id, usuarios) {

        $.ajax({
            url: 'http://localhost:8080/api/roles/' + usuarios.rol.idRol, // Ajusta la URL según la estructura de tu API
            type: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
            success: function (rolData) {
                // Construir los botones
                var boton1 = "<button onclick='EliminarUsuario(" + JSON.stringify(usuarios) + ")' class='btn btn-eliminar' data-id='1'><i class='fas fa-trash'></i></button>";
                var boton2 = "<button onclick='EditarUsuario(" + JSON.stringify(usuarios) + ")' class='btn btn-editar' data-toggle='modal' data-target='#formActualizarUsuarios'><i class='fas fa-edit'></i></button>";

                // Agrega la fila a la DataTable
                dataTable.row.add([
                    usuarios.idUsuarios,
                    rolData.nombreRol,
                    usuarios.nombre,
                    usuarios.documento,
                    usuarios.email,
                    usuarios.telefono,
                    usuarios.estado,
                    boton1 +
                    boton2
                ]).draw();
                // console.log(usuarios.idUsuarios + ' ' + rolData.nombreRol + ' ' + usuarios.nombre + ' ' + usuarios.documento
                // + ' ' + usuarios.email + ' ' + usuarios.telefono + ' ' + usuarios.estado);
            },
            error: function (error) {
                console.error("Error al obtener el nombre del rol: ", error);
            }
        });
    });
}

function consultarRolesL() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/roles",
        "headers": {
            "Content-Type": "application/json"
        },
        success: onExitoRolesL,
        error: onErrorRolesL
    });
}

function onExitoRolesL(data) {
    console.log(data);
    var $dropdown = $("#idRolCrear");
    $.each(data, function () {
        $dropdown.append($("<option />").val(this.idRol).text(this.nombreRol));
    });
    // mostrarRolesConPermisos(data);
}

// function mostrarRolesConPermisos(roles) {

//     // clear the existing list
//     $("#contentRoles .lista-Roles .card-header").remove();
//     $("#contentRoles .lista-Roles .lista-permisos").remove();

//     $.each(roles, function(index,rol) {
//         $('#contentRoles .lista-Roles').append('<div class="card-header">'+rol.nombreRol +'</div>')
//         $('#contentRoles .lista-Roles').append('<div class="card-body lista-permisos"><ul></ul></div>')

//         $.each(rol.permisos, function(index,permiso) {
//             $('#contentRoles .lista-Roles .lista-permisos ul').append('<li>'+permiso.nombrePermiso +" "+permiso.modulo+'</li>')
//         });
//     });

// }
function onErrorRolesL(error) {
    console.log(error)
}

function mostrarFormularioCrearUsuarios() {
    var titulo = $("#tituloFormularioUsuarios");
    titulo.text("CREAR UN NUEVO USUARIO");
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
    var $dropdown = $("#idRol");
    $.each(data, function () {
        $dropdown.append($("<option />").val(this.idRol).text(this.nombreRol));
    });
    // mostrarRolesConPermisos(data);
}

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

function onErrorRoles(error) {
    console.log(error)
}

function mostrarFormularioActualizar(){
    var titulo = $("#tituloFormularioUsuarios");
    titulo.text("Actualizar un usuario");
    var btnform = $("#btn-form");
    btnform.text("Actualizar");
   
}


function EditarUsuario(usuarios){
    mostrarFormularioActualizar();
    $("#roles option[value="+ usuarios.idRol +"]").attr("selected", true);
    $("#nombre").val(usuarios.nombre);
    $("#documento").val(usuarios.documento );
    $("#email").val(usuarios.email);
    $("#telefono").val(usuarios.telefono );
    $("#estado").val(usuarios.estado);
    var preview = document.getElementById("foto-previewActualizar");
    preview.src = "http://localhost:8080/"+usuarios.foto;
    preview.style.display = "block";
    var btnform = $("#btn-form");
    btnform.click(function(){ actualizarUsuario(usuarios.idUsuarios); });
   
}

function actualizarUsuario(idUsuarios){
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

function buscarUsuarioTabla(){
    $("#consultarTablaUsuario").keyup(function(){
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
function onExitoCrearUsuario(data){
    console.log(data);
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-success");
    mensaje.removeClass("alert-danger");
    mensaje.show();
    mensaje.text(data.message);
    $("#formCrearUsuario").trigger("reset");
    $("#foto-preview").attr('src', '');
}
function onErrorCrearUsuario(error){
    console.log(error);
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-danger");
    mensaje.removeClass("alert-success");
    mensaje.show();
    mensaje.text(error.message);
}



function EliminarUsuario(usuarios){
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta seguro de eliminar el usuario '+ usuarios.nombre,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
            confirmButton: 'mi-clase-confirm',
            cancelButton: 'mi-clase-cancel',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            // Realizar la solicitud de eliminación AJAX
            $.ajax({
                url: 'http://localhost:8080/api/usuarios/eliminar/'+usuarios.idUsuarios,
                type: 'Delete',
                success: function(response) {
                    // Manejar la respuesta de eliminación exitosa
                    Swal.fire('Eliminado',response.message, 'success');
                    // Actualizar la tabla o realizar cualquier otra acción necesaria
                    consultarUsuarios();
                },
                error: function(xhr, status, error) {
                    // Manejar los errores de la solicitud AJAX
                    Swal.fire('Error', error.message, 'error');
                }
            });
        }
    });
}