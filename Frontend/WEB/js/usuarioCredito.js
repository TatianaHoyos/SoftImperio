$(document).ready(function () {
    $("#resultadoCrear").hide();
    consultarusuariocredito();
});

function mostrarFormularioActualizarCrearUsuarioCreditos() {
    var titulo = $("#tituloFormularioUsuarioCredito");
    titulo.text("Actualizar un usuario crédito");
    var btnform = $("#btn-form");
    btnform.text("Actualizar");
    btnform.off("click").click(function () {
        var idUsuarioCredito = $("#idUsuarioCredito").val();
        actualizarUsuarioCredito(idUsuarioCredito);
    });
}

function mostrarFormularioCrearUsuarioCreditos() {
    var titulo = $("#tituloFormularioUsuarioCredito");
    titulo.text("Crear un nuevo usuario crédito");
    var btnform = $("#btn-form");
    btnform.text("Guardar");
    btnform.off("click").click(crearUsuarioCredito);
}



function crearUsuarioCredito() {
    var form = $('#formUsuarioCredito')[0];
    var nombre= $("#nombre").val();
    var documento= $("#documento").val();
    var telefono=  $("#telefono").val();

    if (validarCampoVacio(nombre.length, 'Por favor, introduzca un nombre.')) {
        return false;
    }
    if (validarCampoVacio(documento.length, 'Por favor, introduzca un número de documento.')) {
        return false;
    }
    if (documento.length < 7) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops',
            text: 'El número de documento no puede contener menos de 7 caracteres.',
            showConfirmButton: false,
            timer: 1700,
            customClass: {
                popup: 'tamanio-custom'
            }
        });
        return false;
    }
    if (documento && documento.startsWith('0')) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops',
            text: 'El número de documento no puede empezar con 0.',
            showConfirmButton: false,
            timer: 2000,
            customClass: {
                popup: 'tamanio-custom'
            }
        });
        return false;
    }

    if (validarCampoVacio(telefono.length, 'Por favor, introduzca un número de teléfono.')) {
        return false;
    }

    var formData = JSON.stringify({
        "nombre": nombre,
        "documento": documento,
        "telefono": telefono,
        "totalCredito": 0

    });

    handleAjaxRequest(function (token) {
        callApiCrearUsuarioCredito(token,formData);
    });
}

function callApiCrearUsuarioCredito(token,formData){
    $.ajax({
        type: "POST",
        url: "http://localhost:8081/edge-service/v1/service/usuario/credito/crear",
        "headers": {
            "accept": "application/json",
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        data: formData,
        processData: false, 
        success: onExitoCrearUsuariocredito,
        error: onErrorusuariocreditocrear
    });
}


function onExitoCrearUsuariocredito(data) {
    $("#formCrearUsuarioCredito").modal("hide");

    const swalOptions = {
        title: 'Éxito',
        text: data.message,
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#d5c429',
        confirmButtonText: 'Confirmar',
    };

    const swalInstance = Swal.fire(swalOptions);

    setTimeout(() => {
        swalInstance.close();
    }, 2500);

    swalInstance.then((result) => {
        $("#formUsuarioCredito").trigger("reset");
        consultarusuariocredito();
    });
}

function onErrorusuariocreditocrear(error) {
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-danger");
    mensaje.removeClass("alert-success");
    mensaje.show();
    mensaje.text(error.message);
}

function consultarusuariocredito() {
    handleAjaxRequest(callApiConsultarUsuarioCredito);
}

function callApiConsultarUsuarioCredito(token){
    $.ajax({
        type: "GET",
        url: "http://localhost:8081/edge-service/v1/service/usuario/credito/consultar",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        success: onExitousuariocredito,
        error: onErrorusuariocredito
    });
}



function onExitousuariocredito(data) {
    // Destruir la DataTable existente si ya ha sido inicializada
        if ($.fn.DataTable.isDataTable('#tablaUsuarioCreditos')) {
            $('#tablaUsuarioCreditos').DataTable().destroy();
        }
        // Obtén una referencia a la DataTable
        var dataTable = $('#tablaUsuarioCreditos').DataTable({
            dom: '<"row"<"col-md-6"l><"col-md-6"f>>tip',
            pageLength: 5,
            lengthMenu: [5, 10, 25, 50], 
            language: {
                "sProcessing": "Procesando...",
                "sLengthMenu": "Mostrar _MENU_ registros",
                "sZeroRecords": "No se encontraron resultados",
                "sEmptyTable": "Ningún dato disponible en esta tabla",
                "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                "sInfoPostFix": "",
                "sSearch": "Buscar:",
                "sUrl": "",
                "sInfoThousands": ",",
                "sLoadingRecords": "Cargando...",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
                "oAria": {
                    "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                    "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                }
            },
            lengthMenu: [5, 10, 25, 50],
            pageLength: 5, // Número de registros por página
        });
        // Limpia la tabla
        dataTable.clear();
        // Recorre los datos y agrega las filas
        $.each(data, function (id, usuariocredito) {

            var boton0= "<button onclick='abrirModal(" + JSON.stringify(usuariocredito) + ")' class='btn btn-delete' data-id='1'><i class='fas fa-plus'></i></button>";
            var boton1= "<button onclick='DetalleAbono(" + JSON.stringify(usuariocredito) + ")' class='btn btn-delete' data-id='1'><i class='fas fa-hand-holding-usd'></i></button>";
            var boton2 = "<button onclick='DetalleCredito(" + JSON.stringify(usuariocredito) + ")' class='btn btn-delete' data-id='1'><i class='fas fa-money-bill-wave'></i></button>";
            var boton3 = "<button onclick='EliminarUsuarioCredito(" + JSON.stringify(usuariocredito) + ")' class='btn btn-delete' data-id='1'><i class='fas fa-trash'></i></button>";
            var boton4 = "<button onclick='EditarUsuarioCredito(" + JSON.stringify(usuariocredito) + ")' class='btn btn-edit' data-toggle='modal' data-target='#formCrearUsuarioCredito'><i class='fas fa-edit'></i></button>";

            // Agrega la fila a la DataTable
            dataTable.row.add([
                usuariocredito.idUsuarioCredito,
                usuariocredito.nombre,
                usuariocredito.documento,
                usuariocredito.telefono,
                '$'+usuariocredito.totalCredito,
                boton0+' '+boton1+' '+boton2,
                boton3+' '+boton4
            ]).draw();
        });
    }



    function onErrorusuariocredito(error) {
        Swal.fire({
            title: 'Error',
            text: error.responseJSON.message,
            icon:"warning",
            showCancelButton: false,
            confirmButtonColor: ' #d5c429 ',
            confirmButtonText: 'Confirmar',
        }).then((result) => {
        });
    }
    function DetalleCredito(usuariocredito){
        
        handleAjaxRequest(function (token) {
            callApiDetalleCredito(usuariocredito,token);
        });
    }


    function callApiDetalleCredito(usuariocredito,token){
        $.ajax({
            type: "GET",
            url: "http://localhost:8081/edge-service/v1/service/usuario/credito/consultar/id/" + usuariocredito.idUsuarioCredito,
            "headers": {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            success: function (data) {

                if (data.length>0) {
                        $('#detalleCredito').modal('show');
                    if ($.fn.DataTable.isDataTable('#tablaDetalleCredito')) {
                        $('#tablaDetalleCredito').DataTable().destroy();
                    }

                    var dataTable = $('#tablaDetalleCredito').DataTable({
                        dom: '<"row"<"col-md-6"l><"col-md-6"f>>tip',
                        pageLength: 5,
                        lengthMenu: [5, 10, 25, 50], 
                        language: {
                            "sProcessing": "Procesando...",
                            "sLengthMenu": "Mostrar _MENU_ registros",
                            "sZeroRecords": "No se encontraron resultados",
                            "sEmptyTable": "Ningún dato disponible en esta tabla",
                            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                            "sInfoPostFix": "",
                            "sSearch": "Buscar:",
                            "sUrl": "",
                            "sInfoThousands": ",",
                            "sLoadingRecords": "Cargando...",
                            "oPaginate": {
                                "sFirst": "Primero",
                                "sLast": "Último",
                                "sNext": "Siguiente",
                                "sPrevious": "Anterior"
                            },
                            "oAria": {
                                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                            }
                        },
                        lengthMenu: [5, 10, 25, 50],
                        pageLength: 5, // Número de registros por página
                    });

                    dataTable.clear();

                    $.each(data, function (id, credito) {

                        // Agrega la fila a la DataTable
                        dataTable.row.add([
                            (id+1),
                            '$'+credito.precioCredito,
                            credito.fecha
                        ]).draw();
                    });
                } else {
                    Swal.fire({
                        title: 'Exito',
                        text: 'El usuario no tiene créditos asociados.',
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: 'Aceptar'
                    }).then((result) => {
                    });
                }
            },
            error:  function (error) {
                Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar'
            }).then((result) => {
            });
            }
        });
    }



    var idUsuarioCreditoA;
    function DetalleAbono(usuariocredito){
          
        handleAjaxRequest(function (token) {
            callApiDetalleAbono(usuariocredito,token);
        });
    }

    function callApiDetalleAbono(usuariocredito,token){
        idUsuarioCreditoA = usuariocredito
        $.ajax({
            type: "GET",
            url: "http://localhost:8081/edge-service/v1/service/abono/creditos/consultar/id/" + usuariocredito.idUsuarioCredito,
            "headers": {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            success: function (data) {

                if (data.length > 0) {
                    $('#detalleAbono').modal('show');
                    if ($.fn.DataTable.isDataTable('#tablaDetalleAbono')) {
                        $('#tablaDetalleAbono').DataTable().destroy();
                    }
                    var dataTable = $('#tablaDetalleAbono').DataTable({
                        dom: '<"row"<"col-md-6"l><"col-md-6"f>>tip',
                        pageLength: 5,
                        lengthMenu: [5, 10, 25, 50],
                        language: {
                            "sProcessing": "Procesando...",
                            "sLengthMenu": "Mostrar _MENU_ registros",
                            "sZeroRecords": "No se encontraron resultados",
                            "sEmptyTable": "Ningún dato disponible en esta tabla",
                            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
                            "sInfoPostFix": "",
                            "sSearch": "Buscar:",
                            "sUrl": "",
                            "sInfoThousands": ",",
                            "sLoadingRecords": "Cargando...",
                            "oPaginate": {
                                "sFirst": "Primero",
                                "sLast": "Último",
                                "sNext": "Siguiente",
                                "sPrevious": "Anterior"
                            },
                            "oAria": {
                                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
                            }
                        },
                        lengthMenu: [5, 10, 25, 50],
                        pageLength: 5, // Número de registros por página
                    });

                    dataTable.clear();

                    $.each(data, function (id, abonocredito) {

                        // Agrega la fila a la DataTable
                        dataTable.row.add([
                            (id+1),
                            abonocredito.fechaAbono,
                            '$'+abonocredito.precioAbono
                        ]).draw();
                    });
                } else {
                    if(idUsuarioCreditoA.totalCredito!=0){
                        mostrarFormularioAbonar()
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'El total crédito del usuario crédito está en cero, por lo que no puede abona.',
                            showConfirmButton: false,
                            timer: 2700
                        });
                        return;
                    }
                }
            },
            error:  function (error) {
                Swal.fire({
                    title: 'Error',
                    text: error.message,
                    icon: 'error',
                    showCancelButton: false,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar'
                }).then((result) => {
                });
            }
        });
    }

    var idUsuarioCreditoA;


    function mostrarFormularioAbonar(usuariocredito) {
        var idUsuarioCreditoSolo = idUsuarioCreditoA.idUsuarioCredito

        if(idUsuarioCreditoA.totalCredito>0){
        // Aquí abres la modal
            consultarTotalCreditoUsuario(idUsuarioCreditoSolo)
            $('#detalleAbono').modal('hide');
            $('#formAbonarCreditos').modal('show');
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El total crédito del usuario crédito está en cero, por lo que no puede abonar.',
                showConfirmButton: false,
                timer: 2700
            });
            return;
        }
    }

    function consultarTotalCreditoUsuario(idUsuarioCreditoSolo){
          
        handleAjaxRequest(function (token) {
            callApiconsultarTotalCreditoUsuario(idUsuarioCreditoSolo,token);
        });
    }


    function callApiconsultarTotalCreditoUsuario(idUsuarioCreditoSolo,token) {
        $.ajax({
            type: "GET",
            url: "http://localhost:8081/edge-service/v1/service/usuario/credito/consultar/id/" + idUsuarioCreditoSolo,
            "headers": {
                'Authorization': `Bearer ${token}`,
            },
            success: function(data) {
                // Actualiza el totalCrédito en el formulario
                mostrarTotalCreditoEnFormulario(data.totalCredito);
            },
            error: function(error) {
                console.error("Se ha producido un error al consultar el totalCrédito:", error);
                // Puedes manejar el error según tus necesidades
            }
        });
    }
    function mostrarTotalCreditoEnFormulario(totalCredito) {
        // Muestra el totalCrédito en el formulario
        $('#totalCreditoUsuario').text('$'+totalCredito);
    }

    var totalAbonar
    function crearAbono() {
        var form = $('#formAbonarCredito')[0];
        var idUsuarioCreditoSolo = idUsuarioCreditoA.idUsuarioCredito
        var total = idUsuarioCreditoA.totalCredito

        totalAbonar= $("#abonar").val();
        if (validarCampoVacio(totalAbonar.length, 'Por favor, indique el monto que desea abonar.')) {
            return false;
        }
        if (total<totalAbonar){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El monto a abonar no puede ser mayor al total del crédito.',
                showConfirmButton: false,
                timer: 2700
            });
            return;
        }

        var formData = JSON.stringify({
            "idUsuarioCredito": idUsuarioCreditoSolo,
            "precioAbono": totalAbonar

        });
       
          
            handleAjaxRequest(function (token) {
                callApiCrearAbono(formData,token);
            });
        
    }
    function callApiCrearAbono(formData,token){

        $.ajax({
            type: "POST",
            url: "http://localhost:8081/edge-service/v1/service/abono/creditos/crear",
            "headers": {
                "accept": "application/json",
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: formData,
            processData: false,
            success: onExitoCrearAbono,
            error: onErrorCrearAbono
        });
    }

    function onExitoCrearAbono(data) {
        $("#formAbonarCreditos").modal("hide");
    
        const swalOptions = {
            title: 'Éxito',
            text: data.message,
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#d5c429',
            confirmButtonText: 'Confirmar',
        };
    
        const swalInstance = Swal.fire(swalOptions);
    
        setTimeout(() => {
            swalInstance.close();
        }, 2500);
    
        swalInstance.then((result) => {
            $("#formAbonarCredito").trigger("reset");
            DetalleAbono(data);
            $('#tablaDetalleAbono > tbody').empty();
            $('#detalleAbono').modal('show');

            
            actualizarUsuarioCreditoAbonar();
    
        });
    }
    function onErrorCrearAbono(error) {
        var mensaje = $("#resultadoCrear");
        mensaje.addClass("alert-danger");
        mensaje.removeClass("alert-success");
        mensaje.show();
        mensaje.text(error.message);
    
        // Agregar alerta
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo confirmar el abono. Verifique el monto a abonar e intente de nuevo.',
            showConfirmButton: false,
            timer: 2700
        });
    }

    function actualizarUsuarioCreditoAbonar(){
          
        handleAjaxRequest(function (token) {
            callApiactualizarUsuarioCreditoAbonar(token);
        });
    }
    function callApiPutUsuarioCreditoAbonar(idUsuarioCreditoSolo,usuarioCredito,token){
        $.ajax({
            type: "PUT",
            enctype: 'multipart/form-data',
            url: "http://localhost:8081/edge-service/v1/service/usuario/credito/actualizar/id/" + idUsuarioCreditoSolo,
            "headers": {
                "accept": "application/json",
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            data: JSON.stringify(usuarioCredito),
            processData: false,
            success: onExitoActualizarUsuariocreditoAbono,
            error: onErrorusuariocreditocrearAbono
        });        
    }

function EditarUsuarioCredito(usuariocredito) {
    mostrarFormularioActualizarCrearUsuarioCreditos();
    $("#idUsuarioCredito").val(usuariocredito.idUsuarioCredito);
    $("#nombre").val(usuariocredito.nombre);
    $("#documento").val(usuariocredito.documento);
    $("#telefono").val(usuariocredito.telefono);
    $("#totalCredito").val(usuariocredito.totalCredito);
    console.log('Valor de usuariocredito:',usuariocredito);
    var btnform = $("#btn-form");
    btnform.click(function(){ actualizarUsuarioCredito(usuariocredito); });
}

    function actualizarUsuarioCredito(usuariocredito) {
        var form = $('#formUsuarioCredito')[0];
        var nombre= $("#nombre").val();
        var documento= $("#documento").val();
        var telefono=  $("#telefono").val();
        // var totalCredito=usuariocredito.totalCredito;
        console.log('cabio:',usuariocredito);

        if (validarCampoVacio(nombre.length, 'Por favor, introduzca un nombre.')) {
            return false;
        }
        if (validarCampoVacio(documento.length, 'Por favor, introduzca un número de documento.')) {
            return false;
        }
        if (documento.length < 7) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops',
                text: 'El número de documento no puede contener menos de 7 caracteres.',
                showConfirmButton: false,
                timer: 1700,
                customClass: {
                    popup: 'tamanio-custom'
                }
            });
            return false;
        }
        if (documento && documento.startsWith('0')) {
            Swal.fire({
                icon: 'warning',
                title: 'Oops',
                text: 'El número de documento no puede empezar con 0.',
                showConfirmButton: false,
                timer: 2000,
                customClass: {
                    popup: 'tamanio-custom'
                }
            });
            return false;
        }

        if (validarCampoVacio(telefono.length, 'Por favor, introduzca un número de teléfono.')) {
            return false;
        }
        var formData =  JSON.stringify({
            "nombre": nombre,
            "documento": documento,
            "telefono": telefono,
        });
        handleAjaxRequest(function (token) {
            callApiPutUsuarioCredito(formData,usuariocredito,token);
        });
    }
    function callApiPutUsuarioCredito(formData,usuariocredito,token){
        $.ajax({
        type: "Put",
        enctype: 'multipart/form-data',
        url: "http://localhost:8081/edge-service/v1/service/usuario/credito/actualizar/id/" +usuariocredito.idUsuarioCredito,
        "headers": {
            "accept": "application/json",
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          }, // Asegúrate de que la URL sea correcta
        data: formData,
        processData: false,
        success: onExitoActualizarUsuariocredito,
        error: onErrorusuariocreditocrear
    });
    }




    function callApiactualizarUsuarioCreditoAbonar(token) {
        var idUsuarioCreditoSolo = idUsuarioCreditoA.idUsuarioCredito;
        // Llamada AJAX para obtener el UsuarioCredito actual
        $.ajax({
            type: "GET",
            url: "http://localhost:8081/edge-service/v1/service/usuario/credito/consultar/id/" + idUsuarioCreditoSolo,
            "headers": {
                "accept": "application/json",
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            success: function(usuarioCredito) {
                // Sumar totalVenta al totalCredito actual del UsuarioCredito
                usuarioCredito.totalCredito -= totalAbonar;

                // Llamada AJAX para actualizar el UsuarioCredito con el nuevo totalCredito
                handleAjaxRequest(function (token) {
                    callApiPutUsuarioCreditoAbonar(idUsuarioCreditoSolo,usuarioCredito,token);
                });
            },
            error: function(error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error inesperado',
                    showConfirmButton: false,
                    timer: 2700
                });
            }
        });
    }
    function onExitoActualizarUsuariocreditoAbono(error) {
        var mensaje = $("#resultadoCrear");
        mensaje.addClass("alert-danger");
        mensaje.removeClass("alert-success");
        mensaje.show();
        mensaje.text(error.message);
        consultarusuariocredito();
    }
    function onErrorusuariocreditocrearAbono(error) {
        var mensaje = $("#resultadoCrear");
        mensaje.addClass("alert-danger");
        mensaje.removeClass("alert-success");
        mensaje.show();
        mensaje.text(error.message);

    }


function onExitoActualizarUsuariocredito(data) {
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-success");
    mensaje.removeClass("alert-danger");
    mensaje.show();
    mensaje.text(data.message);
    Swal.fire({
        title: 'Éxito',
        text: data.message,
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#d5c429',
        confirmButtonText: 'Confirmar',
        timer: 1700,
    });
    $("#formUsuarioCredito").trigger("reset");
    setTimeout(function () {
        $('#formCrearUsuarioCredito').modal('hide');// Utiliza el selector correcto
        consultarusuariocredito();
    }, 1700);
}






function EliminarUsuarioCredito(usuariocredito) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Estás seguro de eliminar el usuario crédito ' + usuariocredito.nombre + '?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Realizar la solicitud de eliminación AJAX
            handleAjaxRequest(function (token) {
                callApiEliminarUsuarioCredito(usuariocredito,token);
            });
        }
    });
}

function callApiEliminarUsuarioCredito(usuariocredito,token){
    $.ajax({
        url: 'http://localhost:8081/edge-service/v1/service/usuario/credito/eliminar/id/' + usuariocredito.idUsuarioCredito,
        type: 'DELETE',
        "header":{
            'Authorization': `Bearer ${token}`
        },        
        success: function (response) {
            // Mostrar un mensaje de éxito predeterminado
            Swal.fire('Eliminado', 'Usuario crédito eliminado correctamente', 'success');
            // Actualizar la tabla o realizar cualquier otra acción necesaria
            consultarusuariocredito();
        },
        error: function (xhr, status, error) {
            // Manejar los errores de la solicitud AJAX
            Swal.fire({
                icon: 'warning',
                title: 'Oops',
                text:'El usuario crédito ya tiene créditos o abonos asociados, por lo que no es posible eliminarlo.',
                timer:3500,
                customClass: {
                    popup: 'tamanio-custom'
                }
            });
            return false;
        }
    });
}

var totalVenta;
var idUsuarioCredito;



// Definición inicial de buscarVentas
var buscarVentas = function() {};

// Función para abrir la modal
function abrirModal(usuariocredito) {
    idUsuarioCredito = usuariocredito;
    // Aquí abres la modal
    $('#formAsociarCreditos').modal('show');
}

// Función para buscar ventas
function buscarVentasLogica() {
    var form = $('#formAsociarCredito')[0];
    var buscarVenta = $("#buscarVenta").val();
    if (validarCampoVacio(buscarVenta.length, 'Por favor ingrese el Id de la venta.')) {
        return false;
    }
    handleAjaxRequest(function (token) {
        callApiBuscarVentaLogica(buscarVenta,token);
    });
}

function callApiBuscarVentaLogica(buscarVenta,token){
    $.ajax({
        type: "GET",
        url: "http://localhost:8081/edge-service/v1/service/venta/detalle/consultar/ByVenta/" + buscarVenta,
        "headers": {
            "target": "consultar-venta-ByVenta",
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        success: function (data) {
            if (data.length > 0) {
                $('#formAsociarCreditos').modal('show');
                $('#tablaDetalleVenta > tbody').empty();
                var sumaSubtotal = 0;
                $.each(data, function (id, detalleVenta) {
                    sumaSubtotal += detalleVenta.subTotalAPagar;
                    $('#tablaDetalleVenta').append('<tr><td>' + (id + 1) + '</td><td>' + detalleVenta.nombreProducto + '</td><td>' + detalleVenta.cantidadProducto +
                        '</td><td>' + detalleVenta.subTotalAPagar + '$' + '</td></tr>');
                });
                $('#tablaDetalleVenta').append('<tr><td colspan="3" class="text-center">TOTAL DE LA VENTA:</td><td>' + sumaSubtotal + '$</td></tr>');
                totalVenta = sumaSubtotal;
            } else {
                Swal.fire({
                    title: 'Oops',
                    text: 'El idVenta suministrado no se encuentra.',
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'ok',
                    timer: 1700,
                }).then((result) => {
                });
            }
        },
        error: function (error) {
            Swal.fire({
                title: 'Error',
                text: 'error',
                icon: 'error',
                showCancelButton: false,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
                timer: 1700,
            }).then((result) => {
            });
        }
    });
}
// Configura el evento hidden.bs.modal para la modal formAsociarCreditos
$(document).ready(function () {
    $('#formAsociarCreditos').on('hidden.bs.modal', function (e) {
        // Restablece la función buscarVentas
        buscarVentas = function() {};
    });

    // Agrega un evento de clic para el botón de "Buscar"
    $('#btnBuscar').on('click', function () {
        // Llama a la función buscarVentas
        buscarVentasLogica();
    });
});


function callApiCrearCreditos(formDataCredito, token) {
    $.ajax({
        type: "POST",
        url: "http://localhost:8081/edge-service/v1/service/creditos/crear",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        data: formDataCredito,
        processData: false,
        success: onExitoAsociarcredito,
        error: onErrorAsociarcredito
    });
}

function callApiCreditosByVenta(buscarVenta,idUsuarioCreditoSolo, token){
    $.ajax({
        type: "GET",
        url: "http://localhost:8081/edge-service/v1/service/venta/consultar/ByVenta/" + buscarVenta,
        "headers": {
            "target": "consultar-venta-ByVenta",
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        success: function (result) {
            if (result.length > 0) {
                // El idVenta ya está asociado a otro UsuarioCredito
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'El idVenta ya está asociado a un UsuarioCredito. Por favor, seleccione un idVenta válido.',
                    showConfirmButton: false,
                    timer: 2700
                });
            } else {
                // El idVenta no está asociado a ningún UsuarioCredito, continuar con la creación del crédito
                var creditoData = {
                    "idUsuarioCredito": idUsuarioCreditoSolo,
                    "idVenta": buscarVenta,
                    "precioCredito": totalVenta
                };

                // Convertir a formato JSON
                var formDataCredito = JSON.stringify(creditoData);

                // Realizar la solicitud para crear el crédito
                handleAjaxRequest(function (token) {
                    callApiCrearCreditos(formDataCredito, token);
                });
                

            }
        },
        error: function (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error',
                showConfirmButton: false,
                timer: 2700
            });
        }
    });
}


function CrearCredito() {
    var form = $('#formAsociarCredito')[0];
    var buscarVenta= $("#buscarVenta").val();
    // Validar que se tengan los valores necesarios
    if (!totalVenta || totalVenta === 0) {
        // Agregar alerta para totalVenta 0 o nulo
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El total de la venta es 0 o nulo. Por favor, haga clic en el botón Buscar después de haber ingresado el ID para verificar si es la venta correct.',
            showConfirmButton: false,
            timer: 2700
        });
        return;
    }
    var idUsuarioCreditoSolo = idUsuarioCredito.idUsuarioCredito;

    // Realizar la solicitud para verificar si el idVenta ya está asociado a otro UsuarioCredito

    handleAjaxRequest(function (token) {
        callApiCreditosByVenta(buscarVenta,idUsuarioCreditoSolo, token);
    });
    
}
function onExitoAsociarcredito(data) {
    $("#formAsociarCreditos").modal("hide");

    const swalOptions = {
        title: 'Éxito',
        text: data.message,
        icon: 'success',
        showCancelButton: false,
        confirmButtonColor: '#d5c429',
        confirmButtonText: 'Confirmar',
    };

    const swalInstance = Swal.fire(swalOptions);

    setTimeout(() => {
        swalInstance.close();
    }, 2500);

    swalInstance.then((result) => {
        $("#formAsociarCredito").trigger("reset");
        $('#tablaDetalleVenta > tbody').empty();
        handleAjaxRequest(actualizarUsuarioCreditoA);
        handleAjaxRequest(consultarusuariocredito);

    });
}
function onErrorAsociarcredito(error) {
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-danger");
    mensaje.removeClass("alert-success");
    mensaje.show();
    mensaje.text(error.message);

    // Agregar alerta
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al asociar el crédito. Por favor, inténtalo de nuevo y verifica que todo esté completo.',
        showConfirmButton: false,
        timer: 2700
    });
}

function callApiCrearUsuarioXId(idUsuarioCreditoSolo,usuarioCredito, token){
    $.ajax({
        type: "PUT",
        enctype: 'multipart/form-data',
        url: "http://localhost:8081/edge-service/v1/service/usuario/credito/crear/id/" + idUsuarioCreditoSolo,
        "headers": {
            "accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        data: JSON.stringify(usuarioCredito),
        processData: false,
        success: onExitoActualizarUsuariocreditoA,
        error: onErrorusuariocreditocrearA
    });
}


function actualizarUsuarioCreditoA(token) {
    var idUsuarioCreditoSolo = idUsuarioCredito.idUsuarioCredito;

    // Llamada AJAX para obtener el UsuarioCredito actual
    $.ajax({
        type: "GET",
        url: "http://localhost:8081/edge-service/v1/service/usuario/credito/consultar/id/" + idUsuarioCreditoSolo,
        "headers": {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        success: function(usuarioCredito) {
            // Sumar totalVenta al totalCredito actual del UsuarioCredito
            usuarioCredito.totalCredito += totalVenta;

            // Llamada AJAX para actualizar el UsuarioCredito con el nuevo totalCredito
            handleAjaxRequest(function (token) {
                callApiCrearUsuarioXId(idUsuarioCreditoSolo,usuarioCredito, token);
            });

        },
        error: function(error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al obtener el UsuarioCredito.',
                showConfirmButton: false,
                timer: 2700
            });
        }
    });
}
function onExitoActualizarUsuariocreditoA(error) {
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-danger");
    mensaje.removeClass("alert-success");
    mensaje.show();
    mensaje.text(error.message);
    consultarusuariocredito();
}
function onErrorusuariocreditocrearA(error) {
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-danger");
    mensaje.removeClass("alert-success");
    mensaje.show();
    mensaje.text(error.message);

}