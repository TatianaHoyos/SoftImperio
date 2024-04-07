$(document).ready(function () {
    $("#resultadoCrear").hide();
    handleAjaxRequest(consultarUsuarios);
    handleAjaxRequest(consultarRoles);
   
});

function consultarUsuarios(token) {
    $.ajax({
        type: "GET",
        url: hostDomain+"/edge-service/v1/service/usuario/consultar",
        "headers": {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        success: onExitoUsuarios,
        error: onErrorUsuarios
    });
}
function onErrorUsuarios(error) {
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



function consultarRoles(token) {
    $.ajax({
        type: "GET",
        url: hostDomain+"/edge-service/v1/service/roles/consultar",
        "headers": {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        success: onExitoRoles,
        error: onErrorRoles
    });
} 


function onExitoUsuarios(data) {


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

        var boton1 = "<button onclick='EliminarUsuario(" + JSON.stringify(usuarios) + ")' class='btn btn-eliminar' data-id='1'><i class='fas fa-trash'></i></button>";
        var boton2 = "<button onclick='EditarUsuario(" + JSON.stringify(usuarios) + ")' class='btn btn-editar' data-toggle='modal' data-target='#formActualizarUsuarios'><i class='fas fa-edit'></i></button>";

        // Agrega la fila a la DataTable
        dataTable.row.add([
            usuarios.idUsuarios,
            usuarios.rol.nombreRol,
            usuarios.nombre,
            usuarios.documento,
            usuarios.email,
            usuarios.telefono,
            usuarios.estado,
            boton1 +
            boton2
        ]).draw();
      
    });
}


function mostrarFormularioCrearUsuarios() {
    var titulo = $("#tituloFormularioUsuarios");
    titulo.text("CREAR UN NUEVO USUARIO.");
}


const eEmailValido = (email) => {
    return email.match(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    );
  };
  
  $(document).ready(function () {
    // Otro código...

    // Vincula la función validarEmailU al evento input del campo de correo electrónico
    $('#emailCrear').on('input', function () {
        validarEmailU();
    });

    // Otro código...
});

function validarEmailU() {
    const emailMensaje = $('#emailMensaje');
    const email = $('#emailCrear').val();
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
    // // Validar el correo electrónico
    var form = $('#formCrearUsuario')[0];
    var documento= $("#documentoCrear").val();
    var nombre= $("#nombreCrear").val();
    var telefono= $("#telefonoCrear").val();
    var email= $("#emailCrear").val();


    if (validarCampoVacio(documento.length, 'Por favor ingrese un numero de documento')) {
        return false;
    }
    if (documento.length < 7) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops',
            text: 'El numero de documento no puede contener menos de 7 caracteres',
            showConfirmButton: false,
            timer: 1700,
            customClass: {
                popup: 'tamanio-custom'
            }
        });
        return false;
    }
    if (documento && documento.startsWith('0')) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops',
            text: 'El número de documento no puede empezar con 0.',
            showConfirmButton: false,
            timer: 2000,
            customClass: {
                popup: 'tamanio-custom'
            }
        });
        return false;
    }

    if (validarCampoVacio(nombre.length, 'Por favor ingrese un nombre')) {
        return false;
    }
    if (validarCampoVacio(telefono.length, 'Por favor ingrese un numero telefono')) {
        return false;
    }
    if (validarCampoVacio(email.length, 'Por favor ingrese un correo electronico')) {
        return false;
    }

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
    if (email.length > 30) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops',
            text: 'El email no puede contener mas de 30 caracteres',
            showConfirmButton: false,
            timer: 1700,
            customClass: {
                popup: 'tamanio-custom'
            }
        });
        return false;
    }

	// Create an FormData object
    var formData = new FormData(form);
    handleAjaxRequest(function (token) {
        callApiCrearUsuario(token,formData);
});
}



function callApiCrearUsuario(token,formData){
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url:hostDomain+"/edge-service/v1/service/usuario/crear",
        "headers": {
            'Authorization': `Bearer ${token}`,
      },
        data: formData,
        processData: false,
        contentType: false,
        success: onExitoCrearUsuario,
        error: onErrorCrearUsuario
    });
}

function onExitoCrearUsuario(data) {
    $("#formCrearUsuarios").modal("hide");
    const swalOptions = {
        title: 'Exito',
        text: data.message,
        type: 'success',
        icon:"success",
        showCancelButton: false,
        confirmButtonColor: ' #d5c429 ',
        confirmButtonText: 'Confirmar',
    };
    const swalInstance = Swal.fire(swalOptions);

    setTimeout(() => {
        swalInstance.close();
    }, 2000);

    swalInstance.then((result) => {
        $("#formCrearUsuario").trigger("reset");
        $("#foto-preview").attr('src', '');
        handleAjaxRequest(consultarUsuarios);
    });
}


function onErrorCrearUsuario(error){
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-danger");
    mensaje.removeClass("alert-success");
    mensaje.show();
    mensaje.text(error.message);
}




function onExitoRoles(data) {
    var $dropdown = $("#idRolCrear");
    var $dropdownActualizar = $("#idRol");
    $.each(data, function () {
        $dropdown.append($("<option />").val(this.idRol).text(this.nombreRol));
        $dropdownActualizar.append($("<option />").val(this.idRol).text(this.nombreRol));
    });
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
        $('#contentRoles .lista-Roles .lista-permisos ul').append('<li class = "text-white">'+permiso.acciones.nombre +" "+permiso.modulo.nombre+'</li>')
    });
    });
  
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

function mostrarFormularioActualizar(){
    var titulo = $("#tituloFormularioUsuariosA");
    titulo.text("ACTUALIZAR USUARIO.");
    var btnform = $("#btn-form");
    btnform.text("Actualizar");
   
}



function EditarUsuario(usuarios) {
    mostrarFormularioActualizar();
    $("#roles option[value="+ usuarios.idRol +"]").attr("selected", true);
    $("#nombre").val(usuarios.nombre);
    $("#documento").val(usuarios.documento);
    $("#email").val(usuarios.email);
    $("#telefono").val(usuarios.telefono);
    $("#estado").val(usuarios.estado);
    var preview = document.getElementById("foto-previewActualizar");
    preview.src = hostDomainImage+"/"+usuarios.foto;
    preview.style.display = "block";
    var btnform = $("#btn-form");
    
    // Asigna el evento click al botón de actualización con una función anónima que capture los datos del usuario actual
    btnform.off("click").on("click", function () {
        handleAjaxRequest(function (token) {
            actualizarUsuario(usuarios.idUsuarios, token);
        });
    });
    
    // Validación de email al cargar el usuario
    validarEmailUA();
}

const eEmailValidoA = (email) => {
    return email.match(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    );
};
  
$(document).ready(function () {
    // Vincula la función validarEmailU al evento input del campo de correo electrónico
    $('#email').on('input', function () {
        validarEmailUA();
    });
});

function validarEmailUA() {
    const emailMensaje = $('#emailMensajeA');
    const email = $('#email').val();
    emailMensaje.text('');
    if (email.length === 0) {
        // Si el campo de correo electrónico está vacío, no se muestra ningún mensaje
        return;
    }
    if (eEmailValidoA(email)) {
        emailMensaje.text('correo valido');
        emailMensaje.css('color', 'green');
    } else {
        emailMensaje.text('el correo no es valido');
        emailMensaje.css('color', 'red');
    }
}

function actualizarUsuario(idUsuarios, token) {
    var form = $('#formActualizarUsuario')[0];
    var documento= $("#documento").val();
    var nombre= $("#nombre").val();
    var telefono= $("#telefono").val();
    var email= $("#email").val();
    var formData = new FormData(form);
    
    if (validarCampoVacio(documento.length, 'Por favor ingrese un numero de documento')) {
        return false;
    }

    if (documento.length < 7) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops',
            text: 'El numero de documento no puede contener menos de 7 caracteres',
            showConfirmButton: false,
            timer: 1700,
            customClass: {
                popup: 'tamanio-custom'
            }
        });
        return false;
    }
    if (documento && documento.startsWith('0')) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops',
            text: 'El número de documento no puede empezar con 0.',
            showConfirmButton: false,
            timer: 2000,
            customClass: {
                popup: 'tamanio-custom'
            }
        });
        return false;
    }

    if (validarCampoVacio(nombre.length, 'Por favor ingrese un nombre')) {
        return false;
    }
    if (validarCampoVacio(telefono.length, 'Por favor ingrese un numero telefono')) {
        return false;
    }
    if (validarCampoVacio(email.length, 'Por favor ingrese un correo electronico')) {
        return false;
    }

    if (!eEmailValidoA(email)) {
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
    if (email.length > 30) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops',
            text: 'El email no puede contener mas de 30 caracteres',
            showConfirmButton: false,
            timer: 1700,
            customClass: {
                popup: 'tamanio-custom'
            }
        });
        return false;
    }

    $.ajax({
        type: "Put",
        enctype: 'multipart/form-data',
        url:hostDomain+"/edge-service/v1/service/usuario/actualizar/"+idUsuarios,
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        data: formData,
        processData: false,
        contentType: false,
        success: onExitoActualizarUsuario,
        error: onErrorActualizarUsuario
    });
}

function onExitoActualizarUsuario(data) {
    $("#formActualizarUsuarios").modal("hide");

    const swalOptions = {
        title: 'Éxito',
        text: data.message,
        icon: 'success', // Utiliza 'icon' en lugar de 'type'
        showCancelButton: false,
        confirmButtonColor: '#d5c429',
        confirmButtonText: 'Confirmar',
    };

    const swalInstance = Swal.fire(swalOptions);

    setTimeout(() => {
        swalInstance.close();
    }, 2000);

    swalInstance.then((result) => {
        $("#formActualizarUsuario").trigger("reset");
        $("#foto-preview").attr('src', '');
        handleAjaxRequest(consultarUsuarios);
    });
}

function onErrorActualizarUsuario(error) {
    $("#formActualizarUsuarios").modal("hide");
    Swal.fire({
        title: 'Error',
        text: error.responseJSON.message,
        icon: "warning", // Utiliza 'icon' en lugar de 'type'
        showCancelButton: false,
        confirmButtonColor: ' #d5c429 ',
        confirmButtonText: 'Confirmar',
    }).then((result) => {
        // Manejar el error según sea necesario
    });
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
       
handleAjaxRequest(function (token) {
    callApiEliminarUsuario(usuarios,token);

});
 
        }
    });

}
function callApiEliminarUsuario(usuarios,token){
    $.ajax({
        url: hostDomain+'/edge-service/v1/service/usuario/eliminar/'+usuarios.idUsuarios,
        type: 'Delete',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        success: function(response) {
            // Manejar la respuesta de eliminación exitosa
            Swal.fire('Eliminado',response.message, 'success');
            // Actualizar la tabla o realizar cualquier otra acción necesaria
          handleAjaxRequest(consultarUsuarios);
        },
        error: function(xhr, status, error) {
            // Manejar los errores de la solicitud AJAX
            Swal.fire('Error', error.message, 'error');
        }
    });
}