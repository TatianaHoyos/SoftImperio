//import { modulo } from "./configAmbiente";

$(document).ready(function () {
   
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
        url: hostDomain+"/edge-service/v1/authorization/login",
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

    Swal.fire({
        icon: 'warning',
        title:'Oops',
        text: error.responseJSON.message
    });
  
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

    fetch(hostDomain+"/edge-service/v1/authorization/logout", requestOptions)
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

