$(document).ready(function () {
    $("#resultadoLogin").hide();
});

function decrypt(encryptedText) {
    const secreto = "eq#jQ_@o)l^0MDvE";
    const salt = CryptoJS.enc.Utf8.parse(secreto).toString(CryptoJS.enc.Hex);
    const key = CryptoJS.enc.Hex.parse(salt);
    const decrypted = CryptoJS.AES.decrypt(encryptedPassword, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

function login(){
    var secreto="eq#jQ_@o)l^0MDvE";
    var password = $("#passwordLogin").val();

    const salt = CryptoJS.enc.Utf8.parse(secreto).toString(CryptoJS.enc.Hex);
    const key = CryptoJS.enc.Hex.parse(salt);
    const encrypted = CryptoJS.AES.encrypt(password, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    var passwordEncryptada=  encrypted.toString();

    var formData = {
        correo:$("#emailLogin").val(),
        password:passwordEncryptada,
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
    var objetoString = JSON.stringify(data);
    localStorage.setItem('miObjeto', objetoString);
   
    //validar si es admin o colaborador para redireccionarlo a cierta interfaz
    if(data.rol==1){
       
        window.location="./PuntoVentaBarra.html"
    }else if(data.rol==8){
     
        window.location="./puntoVentaMesa.html"
    }
   
}

function onError(error){

    console.log(error.responseJSON)   
    var mensaje =$("#resultadoLogin");
    mensaje.show();
    mensaje.text(error.responseJSON.message);
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