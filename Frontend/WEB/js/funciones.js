//import { modulo } from "./configAmbiente";

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

function login() {
    var secreto = "eq#jQ_@o)l^0MDvE";
    var password = $("#passwordLogin").val();

    const salt = CryptoJS.enc.Utf8.parse(secreto).toString(CryptoJS.enc.Hex);
    const key = CryptoJS.enc.Hex.parse(salt);
    const encrypted = CryptoJS.AES.encrypt(password, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
    });
    var passwordEncryptada = encrypted.toString();

    var formData = {
        correo: $("#emailLogin").val(),
        password: passwordEncryptada,
    };

    // console.log(JSON.stringify(formData))

    if (validarCampoVacio($("#emailLogin").val().length, 'Por favor ingrese un email')) {
        return false;
    }
    if (validarCampoVacio($("#passwordLogin").val().length, 'Por favor ingrese una contraseña')) {
        return false;
    }
    callApiLogin(formData);
   
}

function callApiLogin(formData){
    $.ajax({
        type: "POST",
        url: "http://localhost:8081/edge-service/v1/authorization/login",
        "headers": {
            "Content-Type": "application/json"
        },
        "data": JSON.stringify(formData),
        success: onExito,
        error: onError

    });
}


function onExito(data) {
   
    var permisosModulos = agruparPorModulo(data.rol.permisos);
    data.rol.permisos = permisosModulos;
    var objetoString = JSON.stringify(data);
    localStorage.setItem('miObjeto', objetoString);
    //validar si es admin o colaborador para redireccionarlo a cierta interfaz
    if (permisosModulos.hasOwnProperty('Configuracion')){
        window.location = modulo.configuracion.inicio;
    }else if(permisosModulos.hasOwnProperty('Venta')){
        window.location = modulo.venta.p_mesa;
    }else if(permisosModulos.hasOwnProperty('Producto')){
        window.location = modulo.producto.producto;
    }else if(permisosModulos.hasOwnProperty('Compra')){
        window.location = modulo.compra.compra;
    }else if(permisosModulos.hasOwnProperty('Proveedor')){
        window.location = modulo.proveedor.proveedor;
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Eres un Usuario sin privilegio',
        });
    }

}

function agruparPorModulo(permisos) {
    var resultado = {};
    
    permisos.forEach(function(permiso) {
      var modulo = permiso.modulo.nombre;
      
      if (!resultado.hasOwnProperty(modulo)) {
        resultado[modulo] = {
          nombreModulo: modulo,
          permisos: []
        };
      }
      
      resultado[modulo].permisos.push({
        idPermisos: permiso.idPermisos,
        nombrePermiso: permiso.acciones.nombre
      });
    });
    
    // return Object.values(resultado);
    return resultado;
  }
function onError(error) {

    var mensaje = $("#resultadoLogin");
    mensaje.show();
    mensaje.text(error.responseJSON.message);
}

function logout() {
    $("#cargando").modal("show");
    handleAjaxRequest(callApiLogout);
}
function callApiLogout(token){

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("accessToken", token);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    fetch("http://localhost:8081/edge-service/v1/authorization/logout", requestOptions)
        .then(response => response.text())
        .then(result => {
            $("#cargando").modal("hide");
            localStorage.removeItem('miObjeto');
            window.location = "./iniciosesion.html"
        })
        .catch(error => {
            $("#cargando").modal("hide");
            Swal.fire({
                icon: 'warning',
                title:'Oops',
                text: 'Ocurrió un error inesperado'
            });
        });
}

//logica para crear proveedor
function onExitoCrearProveedor(data) {
    Swal.fire({
        type: 'success',
        text: 'Registro guardado.',
        icon: "success",
        showConfirmButton: false,
        timer: 1500
    });

    setTimeout(() => {
        window.location.reload();
    }, 1500);
}

    function onErrorProv(error) {
    
        // Display the error using SweetAlert2
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error.message || 'Ocurrió un error inesperado.',
        });
    }

// function crearUsuario() {
//     var formData = {
//         nombre: $("#nombre").val(),
//         documento: $("#documento").val(),
//         email: $("#email").val(),
//         telefono: $("#telefono").val(),
//         direccion: $("#direccion").val(),
//     };

//     if (validarCampoVacio($("#nombre").val().length, 'Por favor ingrese un nombre')) {
//         return false;
//     }
//     if (validarCampoVacio($("#documento").val().length, 'Por favor ingrese documento')) {
//         return false;
//     }
//     if (validarCampoVacio($("#email").val().length, 'Por favor ingrese email')) {
//         return false;
//     }
//     if (validarCampoVacio($("#telefono").val().length, 'Por favor ingrese telefono')) {
//         return false;
//     }
//     if (validarCampoVacio($("#direccion").val().length, 'Por favor ingrese direccion')) {
//         return false;
//     }

//     // $.ajax({
//     //     type: "POST",
//     //     url: "http://localhost:8080/api/proveedor/crear",
//     //     "headers": {
//     //         "Content-Type": "application/json"
//     //     },
//     //     "data": JSON.stringify(formData),
//     //     success: onExitoCrearProveedor,
//     //     error: onErrorProv

//     // });
// }