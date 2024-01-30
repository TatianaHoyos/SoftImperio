function validarNumero(e){
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==8) return true;
    patron =/[0-9]/;
    te = String.fromCharCode(tecla);
    return patron.test(te)
}
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

  function sololetrasnombre(e) {
    var key = e.keyCode || e.which;
    var tecla = String.fromCharCode(key).toLowerCase();
    var letras = "abcdefghijklmnopqrstuvwxyz ";
  
    // Verifica si es una letra y la longitud del campo es menor o igual a 29 (para permitir hasta 30 caracteres)
    if (letras.indexOf(tecla) == -1 || e.target.value.length >= 30) {
      return false;
    }
  }


  function sololetras(e){
    key= e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    letras = "àèìòùabcdefghijklmnñopqrstuvwxyz";
    tecla_especial = false
    for(var i in especiales){
        if(key == especiales[i]){
            tecla_especial = true;
            break;
        }
    }

    if(letras.indexOf(tecla)==-1 && !tecla_especial){
        return false;
    }
}

function sololetras(e){
    key= e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    letras = "àèìòùabcdefghijklmnñopqrstuvwxyz";
    especiales = "8-37-38-46-164";

    tecla_especial = false
    for(var i in especiales){
        if(key == especiales[i]){
            tecla_especial = true;
            break;
        }
    }

    if(letras.indexOf(tecla)==-1 && !tecla_especial){
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


const esEmailValido = (email) => {
    return email.match(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    );
  };
  
function validarEmail(e) {
    const emailMensaje = $('#emailLoginMensaje');
    const email = $('#emailLogin').val();
    emailMensaje.text('');
  
    if (esEmailValido(email)) {
        emailMensaje.text('correo valido');
        emailMensaje.css('color', 'green');
    } else {
        emailMensaje.text('el correo no es valido');
        emailMensaje.css('color', 'red');
    }
    //return false;
}
function validarEmail(e) {
    const emailMensaje = $('#emailMensaje');
    const email = $('#email').val();
    emailMensaje.text('');
  
    if (esEmailValido(email)) {
        emailMensaje.text('correo valido');
        emailMensaje.css('color', 'green');
    } else {
        emailMensaje.text('el correo no es valido');
        emailMensaje.css('color', 'red');
    }
    //return false;
}

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

