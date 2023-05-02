
$(document).ready(function () {
    $("#resultadoCrear").hide();
    consultarRoles();
});

function showPreview(event){
    if(event.target.files.length > 0){
      var src = URL.createObjectURL(event.target.files[0]);
      var preview = document.getElementById("foto-preview");
      preview.src = src;
      preview.style.display = "block";
    }
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
    var $dropdown = $("#roles");
    $.each(data, function () {
        $dropdown.append($("<option />").val(this.idRol).text(this.nombreRol));
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
    url:"http://localhost:8080/api/usuario/crear",
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
    mensaje.text(data.message);
}
