
$(document).ready(function () {
    $("#resultadoCrear").hide();
    consultarRoles();
});



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


function crearUsuario(){
    var form = $('#formCrearUsuario')[0];

	// Create an FormData object 
    var formData = new FormData(form);

   console.log(formData);

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

