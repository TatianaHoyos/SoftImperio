$(document).ready(function () {
    $("#resultadoCrear").hide();
    consultarusuariocredito();
    buscarUsuarioCreditoTabla();
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

    if (validarCampoVacio(nombre.length, 'Por favor ingrese un nombre')) {
        return false;
    }
    if (validarCampoVacio(documento.length, 'Por favor ingrese documento')) {
        return false;
    }
    if (documento.length < 7) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops',
            text: 'El numero de documento no puede contener menos de 7 caracteres',
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

    if (validarCampoVacio(telefono.length, 'Por favor ingrese telefono')) {
        return false;
    }

    var formData = JSON.stringify({
        "nombre": nombre,
        "documento": documento,
        "telefono": telefono,
        "totalCredito": 0

    });

    $.ajax({
        type: "POST",
        url: "https://localhost:7084/api/UsuarioCreditos",
        "headers": {
            "accept": "application/json",
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
        type: 'success',
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
        handleAjaxRequest(consultarusuariocredito);
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
    $.ajax({
        type: "GET",
        url: "https://localhost:7084/api/UsuarioCreditos",
        headers: {
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
                usuariocredito.totalCredito+'$',
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
        $.ajax({
            type: "GET",
            url: "https://localhost:7084/api/creditos/" + usuariocredito.idUsuarioCredito,
            "headers": {
                "Content-Type": "application/json",
                //       'Authorization': `Bearer ${token}`
            },
            success: function (data) {

                if (data.length > 0) {
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
                            credito.idVenta,
                            credito.precioCredito+'$',
                            credito.fecha
                        ]).draw();
                    });
                } else {
                    Swal.fire({
                        title: 'Exito',
                        text: 'El usuario no tiene creditos asociados',
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
        idUsuarioCreditoA = usuariocredito
        $.ajax({
            type: "GET",
            url: "https://localhost:7084/api/AbonoCreditos/" + usuariocredito.idUsuarioCredito,
            "headers": {
                "Content-Type": "application/json",
        //        'Authorization': `Bearer ${token}`
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
                            abonocredito.precioAbono+'$'
                        ]).draw();
                    });
                } else {
                    if(idUsuarioCreditoA.totalCredito<0){
                        mostrarFormularioAbonar()
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'El total credito del usuario credito esta en cero asi que no puede abonar.',
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
                text: 'El total credito del usuario credito esta en cero asi que no puede abonar.',
                showConfirmButton: false,
                timer: 2700
            });
            return;
        }
        // Puedes hacer cualquier otra cosa que necesites con el parámetro usuariocredito
        console.log('Valor de idUsuarioCreditoA:', idUsuarioCreditoSolo);
        console.log('Usuario Crédito:', idUsuarioCreditoA);
    }

    function consultarTotalCreditoUsuario(idUsuarioCreditoSolo) {
        $.ajax({
            type: "GET",
            url: "https://localhost:7084/api/UsuarioCreditos/" + idUsuarioCreditoSolo,
            success: function(data) {
                // Actualiza el totalCrédito en el formulario
                mostrarTotalCreditoEnFormulario(data.totalCredito);
            },
            error: function(error) {
                console.error("Error al consultar el totalCrédito:", error);
                // Puedes manejar el error según tus necesidades
            }
        });
    }
    function mostrarTotalCreditoEnFormulario(totalCredito) {
        // Muestra el totalCrédito en el formulario
        $('#totalCreditoUsuario').text(totalCredito+'$');
    }

    var totalAbonar
    function crearAbono() {
        var form = $('#formAbonarCredito')[0];
        var idUsuarioCreditoSolo = idUsuarioCreditoA.idUsuarioCredito
        var total = idUsuarioCreditoA.totalCredito
        console.log('Valor de idUsuarioCreditoA:', idUsuarioCreditoSolo);
        console.log('total:', total);

        totalAbonar= $("#abonar").val();
        console.log('totalAbonar:', totalAbonar);
        if (validarCampoVacio(totalAbonar.length, 'Por favor ingrese el monto a abonar.')) {
            return false;
        }
        if (total<totalAbonar){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El moto a abonar no puene ser mayor al total crédito .',
                showConfirmButton: false,
                timer: 2700
            });
            return;
        }

        var formData = JSON.stringify({
            "idUsuarioCredito": idUsuarioCreditoSolo,
            "precioAbono": totalAbonar

        });

        $.ajax({
            type: "POST",
            url: "https://localhost:7084/api/AbonoCreditos",
            "headers": {
                "accept": "application/json",
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
            type: 'success',
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
            text: 'Nose pudo confirmar el abono verifique en monto a abonar y intenta de nuevo.',
            showConfirmButton: false,
            timer: 2700
        });
    }

    function actualizarUsuarioCreditoAbonar() {
        var idUsuarioCreditoSolo = idUsuarioCreditoA.idUsuarioCredito;
        console.log('Valor de idUsuarioCreditoAbonar:', idUsuarioCreditoSolo);
        // Llamada AJAX para obtener el UsuarioCredito actual
        $.ajax({
            type: "GET",
            url: "https://localhost:7084/api/UsuarioCreditos/" + idUsuarioCreditoSolo,
            "headers": {
                "accept": "application/json",
                "Content-Type": "application/json"
            },
            success: function(usuarioCredito) {
                // Sumar totalVenta al totalCredito actual del UsuarioCredito
                usuarioCredito.totalCredito -= totalAbonar;

                // Llamada AJAX para actualizar el UsuarioCredito con el nuevo totalCredito
                $.ajax({
                    type: "PUT",
                    enctype: 'multipart/form-data',
                    url: "https://localhost:7084/api/UsuarioCreditos/" + idUsuarioCreditoSolo,
                    "headers": {
                        "accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(usuarioCredito),
                    processData: false,
                    success: onExitoActualizarUsuariocreditoAbono,
                    error: onErrorusuariocreditocrearAbono
                });
            },
            error: function(error) {
                console.error("Error al obtener el UsuarioCredito:", error);
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





function EditarUsuarioCredito(usuariocredito) {
    mostrarFormularioActualizarCrearUsuarioCreditos();
    $("#idUsuarioCredito").val(usuariocredito.idUsuarioCredito);
    $("#nombre").val(usuariocredito.nombre);
    $("#documento").val(usuariocredito.documento);
    $("#telefono").val(usuariocredito.telefono);
    var btnform = $("#btn-form");
    btnform.click(function(){ actualizarUsuarioCredito(); });
}

function actualizarUsuarioCredito() {
    var form = $('#formUsuarioCredito')[0];
    var nombre= $("#nombre").val();
    var documento= $("#documento").val();
    var telefono=  $("#telefono").val();
    if (validarCampoVacio(nombre.length, 'Por favor ingrese un nombre')) {
        return false;
    }
    if (validarCampoVacio(documento.length, 'Por favor ingrese documento')) {
        return false;
    }
    if (documento.length < 7) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops',
            text: 'El numero de documento no puede contener menos de 7 caracteres',
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

    if (validarCampoVacio(telefono.length, 'Por favor ingrese telefono')) {
        return false;
    }
    var formData =  JSON.stringify({
        "idUsuarioCredito":  $("#idUsuarioCredito").val(),
        "nombre": nombre,
        "documento": documento,
        "telefono": telefono,
      });
    $.ajax({
        type: "Put",
        enctype: 'multipart/form-data',
        url: "https://localhost:7084/api/UsuarioCreditos/" + $("#idUsuarioCredito").val(),
        "headers": {
            "accept": "application/json",
            "Content-Type": "application/json"
          }, // Asegúrate de que la URL sea correcta
        data: formData,
        processData: false,
        success: onExitoActualizarUsuariocredito,
        error: onErrorusuariocreditocrear
    });
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
        type: 'success',
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
            $.ajax({
                url: 'https://localhost:7084/api/UsuarioCreditos/' + usuariocredito.idUsuarioCredito,
                type: 'DELETE',
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
                        text:'El usuario crédito ya tiene créditos o abonos asociados asi que no es posible eliminarlo.',
                        timer:3500,
                        customClass: {
                            popup: 'tamanio-custom'
                        }
                    });
                    return false;
                }
            });
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

    // Puedes hacer cualquier otra cosa que necesites con el parámetro usuariocredito
    console.log('Usuario Crédito:', usuariocredito);
}

// Función para buscar ventas
function buscarVentasLogica(usuariocredito) {
    var form = $('#formAsociarCredito')[0];
    var buscarVenta = $("#buscarVenta").val();
    if (validarCampoVacio(buscarVenta.length, 'Por favor ingrese el Id de la venta.')) {
        return false;
    }

    $.ajax({
        type: "GET",
        url: "https://localhost:7084/api/DetalleVentas/ByVenta/" + buscarVenta,
        "headers": {
            "Content-Type": "application/json",
            //       'Authorization': `Bearer ${token}`
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
                    text: 'El idVenta suministrado no se encuentra ',
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





function CrearCredito() {
    var form = $('#formAsociarCredito')[0];
    var buscarVenta= $("#buscarVenta").val();
    // Validar que se tengan los valores necesarios
    if (!totalVenta || totalVenta === 0) {
        // Agregar alerta para totalVenta 0 o nulo
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El total de la venta es 0 o nulo. Por favor, dele en el boton buscar despues de aver ingresado el id para ver si es la venta correcta .',
            showConfirmButton: false,
            timer: 2700
        });
        return;
    }
    var idUsuarioCreditoSolo = idUsuarioCredito.idUsuarioCredito;

    // Realizar la solicitud para verificar si el idVenta ya está asociado a otro UsuarioCredito
    $.ajax({
        type: "GET",
        url: "https://localhost:7084/api/Creditos/ByVenta/" + buscarVenta,
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json"
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
                console.log(formDataCredito);

                // Realizar la solicitud para crear el crédito
                $.ajax({
                    type: "POST",
                    url: "https://localhost:7084/api/Creditos",
                    headers: {
                        "accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    data: formDataCredito,
                    processData: false,
                    success: onExitoAsociarcredito,
                    error: onErrorAsociarcredito
                });
            }
        },
        error: function (error) {
            console.error("Error al verificar el idVenta:", error);
        }
    });
}
function onExitoAsociarcredito(data) {
    $("#formAsociarCreditos").modal("hide");

    const swalOptions = {
        title: 'Éxito',
        text: data.message,
        type: 'success',
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
        actualizarUsuarioCreditoA();
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
        text: 'Ocurrió un error al asociar el crédito. Por favor, inténtalo de nuevo y verifique que esta todo completo.',
        showConfirmButton: false,
        timer: 2700
    });
}




function actualizarUsuarioCreditoA() {
    var idUsuarioCreditoSolo = idUsuarioCredito.idUsuarioCredito;

    // Llamada AJAX para obtener el UsuarioCredito actual
    $.ajax({
        type: "GET",
        url: "https://localhost:7084/api/UsuarioCreditos/" + idUsuarioCreditoSolo,
        "headers": {
            "accept": "application/json",
            "Content-Type": "application/json"
          },
        success: function(usuarioCredito) {
            // Sumar totalVenta al totalCredito actual del UsuarioCredito
            usuarioCredito.totalCredito += totalVenta;

            // Llamada AJAX para actualizar el UsuarioCredito con el nuevo totalCredito
            $.ajax({
                type: "PUT",
                enctype: 'multipart/form-data',
                url: "https://localhost:7084/api/UsuarioCreditos/" + idUsuarioCreditoSolo,
                "headers": {
                    "accept": "application/json",
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(usuarioCredito),
                processData: false,
                success: onExitoActualizarUsuariocreditoA,
                error: onErrorusuariocreditocrearA
            });
        },
        error: function(error) {
            console.error("Error al obtener el UsuarioCredito:", error);
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