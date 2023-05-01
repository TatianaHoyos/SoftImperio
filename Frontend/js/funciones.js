function login(){
    var datos= $("#formLogin").serialize();
    
    if (validarCampoVacio($("#passwordLogin").val().length ,'Por favor ingrese una contraseña')) {
        return false;
    }

    if (validarCampoVacio($("#emailLogin").val().length ,'Por favor ingrese un email')) {
        return false;
    }

    $.ajax({
        type: "POST",
        url: "../controlador/c_inisiosesion.php",
        data: datos
    })
    .done(function(resultado){
        console.log(resultado);
        this.resultado=parseInt(resultado);
        switch(this.resultado){
            case 1:
                window.location="../vista/administrador.php";
                break;
            case 2:
                window.location="../vista/p_ventamesa.php";
                break;
            case 3:
                window.location="../vista/cliente/v_cliente.php";
                break;
            default:
                $("#resultadoLogin").show();
                $("#resultadoLogin").text(resultado);             
                break;
        }
    });
}