
function validarNumeroUC(e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 8) return true;
    patron = /[0-9]/;
    te = String.fromCharCode(tecla);
    // Verifica si la longitud actual del campo es menor o igual a 14 (ya que se permiten 15 caracteres)
    if (e.target.value.length <= 14) {
    return patron.test(te);
    } else {
      // Si ya hay 15 caracteres, no se permite ingresar más
    return false;
    }
}



function validarNumero(e){
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==8) return true;
    patron =/[0-9]/;
    te = String.fromCharCode(tecla);
    return patron.test(te)
}
function validarPrecio(e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 8) return true;
    patron = /[0-9.]/;
    te = String.fromCharCode(tecla);

    // Verifica si el carácter ingresado es un número o un punto, y no permite más de un punto
    if (patron.test(te) && (te !== '.' || e.target.value.indexOf('.') === -1)) {
        return true;
    } else {
        return false;
    }
}

function validarDocumento(e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 8) return true;
    patron = /[0-9]/;
    te = String.fromCharCode(tecla);

    // Verifica si la longitud actual del campo es menor o igual a 10 y el documento no comienza con cero
    if (e.target.value.length < 10 && !(e.target.value === '0' && te === '0')) {
        return patron.test(te);
    } else {
        return false;
    }
}
function validarCelular(e) {
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla == 8) return true;
    patron = /[0-9]/;
    te = String.fromCharCode(tecla);

    // Verifica si la longitud actual del campo es menor o igual a 10
    if (e.target.value.length < 10) {
        return patron.test(te);
    } else {
        return false;
    }
}

function validarDireccion(inputDireccion) {
    const valor = inputDireccion.value;
    const direccionMensaje = $('#direccionMensaje');

    // Validar que la dirección no esté vacía y tenga una longitud máxima de, por ejemplo, 100 caracteres
    if (valor.trim() !== '' && valor.length <= 100) {
        // Si cumple las condiciones, mostrar mensaje verde
        direccionMensaje.text('Dirección válida');
        direccionMensaje.css('color', 'green');
        inputDireccion.style.border = '1px solid green';
        return true;
    } else {
        // Si la dirección está vacía o supera la longitud permitida, mostrar mensaje rojo
        direccionMensaje.text('Dirección no válida');
        direccionMensaje.css('color', 'red');
        inputDireccion.style.border = '1px solid red';
        return false;
    }
}

function sololetrasnombre(e) {
    var key = e.keyCode || e.which;
    var tecla = String.fromCharCode(key).toLowerCase();
    var letras = "abcdefghijklmnopqrstuvwxyz ";
    // Verifica si es una letra y la longitud del campo es menor o igual a 29 (para permitir hasta 30 caracteres)
    if (letras.indexOf(tecla) == -1 || e.target.value.length >= 30) {
        return false;
    }
}


function contrasena(e){
    key1= e.keyCode || e.which;
    tecla1 = String.fromCharCode(key1).toLowerCase();
    contrasena1 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWYZ0123456789";
    especialesContra = "8-34-35-36-37-38-43-45-46-164-64";
    tecla_contra = false;
    for(var i in especialesContra){
        if(key1 == especialesContra[i]){
            tecla_contra = true;
            break;
        }
    }

    if(contrasena1.indexOf(tecla1)==-1 && !tecla_contra){
        return false;
    }
}
function validarEmail() {
    const emailMensaje = $('#emailMensaje');
    const email = $('#email').val();
    emailMensaje.text('');

    if (esEmailValido(email)) {
        emailMensaje.text('Correo válido');
        emailMensaje.css('color', 'green');
    } else {
        emailMensaje.text('El correo no es válido');
        emailMensaje.css('color', 'red');
    }
}

const esEmailValido = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

function validarCampoVacio(longitudCampo,mensaje) {
    if(longitudCampo <1)
    {
    Swal.fire({
        icon: 'warning',
        title:'Oops',
        text: mensaje
    });
    return true;
    }
}



//validaciones para form de productos y categorias
function validarNombre(event) {
    const charCode = event.charCode;
    const key = String.fromCharCode(charCode);
    const regex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]$/; // Expresión regular para permitir letras, espacios y caracteres especiales

    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }

    return true;
}

function mostrarError(mensaje) {
    const errorSpan = document.getElementById('nombreError');
    errorSpan.textContent = mensaje;
}

function ocultarError() {
    const errorSpan = document.getElementById('nombreError');
    errorSpan.textContent = '';
}

//referencia
function validarReferencia(event) {
    const charCode = event.charCode;
    const key = String.fromCharCode(charCode);
    const regex = /^[a-zA-Z0-9\s]$/; // Expresión regular para permitir letras, números y espacios

    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }

    return true;
}
function validarNumeros(event) {
    const charCode = event.charCode;
    const key = String.fromCharCode(charCode);
    const regex = /^[0-9]$/; // Expresión regular para permitir solo números

    if (!regex.test(key)) {
        event.preventDefault();
        return false;
    }

    return true;
}