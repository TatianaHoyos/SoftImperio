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