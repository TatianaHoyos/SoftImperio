function validarNumero(e){
    tecla = (document.all) ? e.keyCode : e.which;
    if (tecla==8) return true;
    patron =/[0-9]/;
    te = String.fromCharCode(tecla);
    return patron.test(te)
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