$(document).ready(function () {
  $("#resultadoCrear").hide();
    // consultarCategorias();
});


function crearProducto(){
    var form = $('#formCrearProducto')[0];

	// Create an FormData object 
    var formData = new FormData(form);

   console.log(formData);

   $.ajax({
    type: "POST",
    enctype: 'multipart/form-data',
    url:"http://localhost:8080/api/producto/crear",
    data: formData,
    processData: false,
    contentType: false,
    success: onExitoCrearProducto,
    error: onErrorCrearProducto
});

}

function onExitoCrearProducto(data){
    console.log(data);
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-success");
    mensaje.removeClass("alert-danger");
    mensaje.show();
    mensaje.text(data.message);
    $("#formCrearProducto").trigger("reset");
    $("#foto-preview").attr('src', '');
}
function onErrorCrearProducto(error){
    console.log(error);
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-danger");
    mensaje.removeClass("alert-success");
    mensaje.show();
    mensaje.text(error.message);
}
