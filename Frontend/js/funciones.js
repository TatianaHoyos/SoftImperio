$(document).ready(function () {
    $("#resultadoLogin").hide();
});

function login(){
    var formData = {
        correo:$("#emailLogin").val(),
        password:$("#passwordLogin").val(),
      };

      console.log(JSON.stringify(formData))
    
    if (validarCampoVacio($("#emailLogin").val().length ,'Por favor ingrese un email')) {
        return false;
    }
    if (validarCampoVacio($("#passwordLogin").val().length ,'Por favor ingrese una contraseña')) {
        return false;
    }

    $.ajax({
        type: "POST",
        url:"http://localhost:8080/api/login",
        "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify(formData),
          success: onExito,
          error: onError
          
    });
}

function onExito(data){

    console.log(data)
    //validar si es admin o colaborador para redireccionarlo a cierta interfaz
    if(data.rol==1){
        window.location="./registrocolaborador.html"
    }else if(data.rol==2){
        window.location="./puntomesa.html"
    }
}

function onError(error){

    console.log(error)   
    var mensaje =$("#resultadoLogin");
    mensaje.show();
    mensaje.text(error.message);
}
//logica para crear proveedor
function onExitoCrearProveedor(data){

   
        Swal.fire({
          type: 'success',
          text: 'Registro guardado',
          icon:"success",
          showConfirmButton: false,
          timer: 2000
        });

        window.location="./nuestrosProveedores.html"

}

function onErrorProv(error){

    console.log(error)   
    var mensaje =error;
    mensaje.show();
    mensaje.text(error.message);
}

function crearUsuario(){
    var formData = {
        nombre:$("#nombre").val(),
        documento:$("#documento").val(),
        email:$("#email").val(),
        telefono:$("#telefono").val(),
        direccion:$("#direccion").val(),
      };

      console.log(JSON.stringify(formData))
    
    if (validarCampoVacio($("#nombre").val().length ,'Por favor ingrese un nombre')) {
        return false;
    }
    if (validarCampoVacio($("#documento").val().length ,'Por favor ingrese documento')) {
        return false;
    }
    if (validarCampoVacio($("#email").val().length ,'Por favor ingrese email')) {
        return false;
    }
    if (validarCampoVacio($("#telefono").val().length ,'Por favor ingrese telefono')) {
        return false;
    }
    if (validarCampoVacio($("#direccion").val().length ,'Por favor ingrese direccion')) {
        return false;
    }

    $.ajax({
        type: "POST",
        url:"http://localhost:8080/api/proveedor/crear",
        "headers": {
            "Content-Type": "application/json"
          },
          "data": JSON.stringify(formData),
          success: onExitoCrearProveedor,
          error: onErrorProv
          
    });
}