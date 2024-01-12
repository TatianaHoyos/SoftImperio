$(document).ready(function () {
    $("#resultadoCrear").hide();
    consultarUsuarios();
    consultarRoles();
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



function mostrarTablaUsuarios(data) {
    $('#tablaUsuarios > tbody').empty();
    $.each(data, function(id, usuarios,) {
        var nombreRol="";
    if(usuarios.idRol==1){
        nombreRol="Administrador";
    } else if(usuarios.idRol==4){
        nombreRol="Supervisor";
    }else if(usuarios.idRol==8){
        nombreRol="Colaborador";
    }else if(usuarios.idRol==9){
        nombreRol="Mesero";
    }


        var boton1 = "<button onclick='EliminarUsuario("+ JSON.stringify(usuarios) +")' class='btn btn-delete' data-id='1'><i class='fas fa-trash'></i></button>";
        var boton2 = "<button onclick='EditarUsuario("+ JSON.stringify(usuarios) +")' class='btn btn-edit' data-toggle='modal' data-target='#formActualizarUsuarios'><i class='fas fa-edit'></i></button>";
        

        $('#tablaUsuarios').append('<tr><td>' + usuarios.idUsuarios + '</td><td>' + nombreRol+ '</td><td>' + usuarios.nombre+
        '</td><td>' + usuarios.documento+ '</td><td>' + usuarios.email+ '</td><td>' + usuarios.telefono+ '</td><td>' + usuarios.estado+
        '</td><td>' + boton2 + '</td><td>' + boton1 + '</td></tr>');
        console.log(usuarios.idUsuarios + ' ' + usuarios.idRol + ' ' + usuarios.nombre + ' ' + usuarios.documento 
        + ' ' + usuarios.email + ' ' + usuarios.telefono + ' ' + usuarios.estado);

    });
}


function mostrarFormularioActualizar(){
    var titulo = $("#tituloFormularioUsuarios");
    titulo.text("Actualizar un usuario");
    var btnform = $("#btn-form");
    btnform.text("Actualizar");
   
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

function onErrorRoles(error) {
    console.log(error)
}







function EditarUsuario(usuarios){
    mostrarFormularioActualizar();
    $("#roles option[value="+ usuarios.idRol +"]").attr("selected", true);
    $("#nombre").val(usuarios.nombre);
    $("#documento").val(usuarios.documento );
    $("#email").val(usuarios.email);
    $("#telefono").val(usuarios.telefono );
    $("#estado").val(usuarios.estado);
    var preview = document.getElementById("foto-preview");
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
        cancelButtonText: 'Cancelar'
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