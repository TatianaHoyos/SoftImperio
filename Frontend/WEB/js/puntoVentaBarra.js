var categorias;
var productos;


$(document).ready(function () {
    $("#cargando").modal("show");
    handleAjaxRequest(consultarCategorias)
    selectCategoria();
    contadorCantidad();
    mostrarVentaNotificacionPorRedireccion();
    // preventCloseLoading();
});

function mostrarVentaNotificacionPorRedireccion(){
            // Si ya estás en la URL de redirección, verifica el indicador en localStorage
            var redireccionPendiente = localStorage.getItem('redireccionPorNotificacion');

    if (redireccionPendiente === 'true') {
        var data = JSON.parse(localStorage.getItem('notificacion'));
        var idVenta = localStorage.getItem('idVenta');

        // Tu código aquí
        data.forEach(function (detalleVenta) {
            mostrarProductosTablaNotificacion(detalleVenta.nombreProducto + ' ' + detalleVenta.referenciaProducto,
                detalleVenta.subTotalAPagar, detalleVenta.idProductos, detalleVenta.cantidadProducto);
                const total = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(detalleVenta.totalVenta);

            $("#totalVenta").text(total);
            $("#estadoPedidoVenta").val(idVenta);
        });

        localStorage.removeItem('redireccionPorNotificacion');
        localStorage.removeItem('idVenta');
        localStorage.removeItem('notificacion');
    }
}

function mostrarProductosTablaNotificacion(nombre, precio, idProducto,cantidad) {
    var botonEliminar = ' <th><button class="btn btn-danger"  onclick="eliminarRegistroPedido(this)"><i class="fas fa-trash-alt"></i></button></th>';
    var nombreProducto = ' <th>' + nombre + '</th>';
    var precioProducto = ' <th class="precio">' + precio + '</th>';
    var cantidadBoton = '<th><div class="quantity">'
        + '<div class="qty">'
        + ' <span class="minus bg-dark">-</span>'
        + '<input type="number" class="count" name="qty" value="'+cantidad+'" readonly>'
        + ' <span class="plus bg-dark">+</span>'
        + '</div>' +
        '</div></th>';

    var totalProductos = ' <th class="total">' + precio + '</th>';
    $('#tabla').append('<tr id="tr-' + idProducto + '" >' + nombreProducto + precioProducto + cantidadBoton + totalProductos + botonEliminar + '</tr>');
}

function consultarCategorias(token) {
    $("#textCargando").text("Cargando Categorias");
    $.ajax({
        type: "GET",
        url: hostDomain+"/edge-service/v1/service/categorias/consultar",
        "headers": {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        success: onExitoCategorias,
        error: onErrorCategorias
    });
}

function onExitoCategorias(data) {
    categorias = data;
    handleAjaxRequest(function (token) {
        consultarProductosAgrupados(data, token);
    });
    var $dropdown = $("#idCategoria");
    $dropdown.append($("<option />").val("-1").text("Todos"));
    $.each(data, function () {
        $dropdown.append($("<option />").val(this.idCategoria).text(this.nombreCategoria));
    });

}
function onErrorCategorias(error) {
    Swal.fire({
        title: 'Error',
        text: error.responseJSON.value.message,
        icon:"warning",
        showCancelButton: false,
        confirmButtonColor: ' #d5c429 ',
        confirmButtonText: 'Confirmar',
    }).then((result) => {
       
    });
    ocultarCargando();
}



function consultarProductosAgrupados(categorias,token) {
    $("#textCargando").text("Cargando Productos");
      $.ajax({
        type: "GET",
        url: hostDomain+"/edge-service/v1/service/productos/consultar/agrupados",
        "headers": {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        success: function (data) {
            onExitoProductos(data, categorias);
        },
        error: onErrorProductos

    });
}

function onExitoProductos(data, categorias) {
    productos = data;
    mostrarProductos(data, categorias);
    ocultarCargando();
}

function ocultarCargando(){
    setTimeout(function() {
        var elemento = $('#cargando');
        elemento.modal("hide");
      }, 600);
}

function mostrarProductos(data, categorias) {
    var $contenedor = $("#ContenedorProductos");
    $contenedor.empty();

    $.each(data, function () {
        var categoriaId = this.idCategoria;
        var productos = this.productos;
        var nombreCategoria = "";

        $.each(categorias, function () {
            if (this.idCategoria == categoriaId) {
                nombreCategoria = this.nombreCategoria;
            }
        });

        // Crear un contenedor para la categoría
        var categoriaContainer = $("<div>").addClass("categoria-container");
        categoriaContainer.append("<h4 class='text-white'>Categoría " + nombreCategoria + "</h4>");
        var productoContainer = $("<div>").addClass("d-flex flex-wrap");
        categoriaContainer.append(productoContainer);
        // Iterar a través de los productos de la categoría
        $.each(productos, function () {
            var producto = this;

            // Crear una tarjeta para cada producto
            var productoCard = $("<div>").addClass("card m-2").css("width", "10rem").attr("id", "cardProducto");

            // Configurar la imagen
            var imagen = $("<img>").addClass("card-img-top").css("background-color", "rgba(77, 76, 97, 0.28)").attr("src",hostDomainImage+"/"+ producto.foto).attr("width", "100").attr("alt", "Producto");
            productoCard.append(imagen);

            // Configurar el cuerpo de la tarjeta
            var cardBody = $("<div>").addClass("card-body p-1 text-center");
            cardBody.append("<h5 class='card-title'>" + producto.nombreProducto + "</h5>");
            cardBody.append("<label  class='text-white'>Presentación</label>");

            // Crear un select para las referencias
            var stringSinEspacios = producto.nombreProducto.replace(/\s+/g, '')
            var selectReferencia = $("<select>").attr("id", "select" + stringSinEspacios).attr("name", "select" + stringSinEspacios).addClass("form-control");

            // Iterar a través de las referencias del producto
            $.each(producto.referencias, function () {
                var referencia = this;
                //selectReferencia.attr("id", "idReferencia" + referencia.idProducto).attr("name", "idReferencia" + referencia.idProducto);
                cardBody.attr("for", "idReferencia" + referencia.idProducto)
                // Agregar opciones al select
                var opcion = $("<option>").attr("value", referencia.idProducto).text(referencia.nombreReferencia);
                selectReferencia.append(opcion);
            });

            cardBody.append(selectReferencia);
            cardBody.append("<button type='button' onclick='seleccionarProducto(" + JSON.stringify(producto) + ", this)' class='btn btn-primary mt-2'>Agregar</button>");

            productoCard.append(cardBody);
            productoContainer.append(productoCard);
        });

        // Agregar la categoría al contenedor principal
        $contenedor.append(categoriaContainer);
    });
}

function onErrorProductos(error) {
    ocultarCargando();
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

function selectCategoria() {
    // Captura el evento 'change' en el elemento <select> con id 'miSelect'
    $("#idCategoria").change(function () {
        // Obtiene el valor seleccionado
        var seleccion = $(this).val();
        var productoSeleccionado;

        $.each(productos, function () {
            if (seleccion == this.idCategoria) {
                productoSeleccionado = [this];
                return;
            }

            if (seleccion == -1) {
                productoSeleccionado = productos;
                return;
            }
        });
        mostrarProductos(productoSeleccionado, categorias);
    });
}

function seleccionarProducto(producto, button) {
    var selectId = button.previousElementSibling.id;
    var seleccion = $("#" + selectId).val();
    var referencia;

    $.each(producto.referencias, function () {
        if (this.idProducto == seleccion) {
            referencia = this;
            return;
        }
    });

    if (existeIdEnTabla(seleccion)) {
        alert("Ya seleccionó el producto");
        return;
    }
    mostrarProductosTabla(producto.nombreProducto + " " + referencia.nombreReferencia,
        referencia.precio, seleccion);

        //agregar valor de primer registro
        const totalVentaTexto = $("#totalVenta").text();
        // Eliminar el formato de moneda y convertirlo a un número
        const venta = parseInt(totalVentaTexto.replace(/[^0-9.-]+/g, '').replace('.', ''));
  
        var totalV = referencia.precio + venta;
        const total = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(totalV);

            $("#totalVenta").text(total);
       

    //se esta limpiando un input oculto que ayuda a validar si el pedido proviene de notificacion
        $("#estadoPedidoVenta").val("");
}

function existeIdEnTabla(id) {
    return $("#tabla tbody tr#tr-" + id).length > 0;
}

function mostrarProductosTabla(nombre, precio, idProducto) {
    var botonEliminar = ' <th><button class="btn btn-danger"  onclick="eliminarRegistroPedido(this)"><i class="fas fa-trash-alt"></i></button></th>';
    var nombreProducto = ' <th>' + nombre + '</th>';
    const totalP = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precio);
    var precioProducto = ' <th class="precio">' + totalP + '</th>';
    var cantidadBoton = '<th><div class="quantity">'
        + '<div class="qty">'
        + ' <span class="minus bg-dark">-</span>'
        + '<input type="number" class="count" name="qty" value="1" readonly>'
        + ' <span class="plus bg-dark">+</span>'
        + '</div>' +
        '</div></th>';

    var totalProductos = ' <th class="total">' + totalP + '</th>';
    $('#tabla').append('<tr id="tr-' + idProducto + '" >' + nombreProducto + precioProducto + cantidadBoton + totalProductos + botonEliminar + '</tr>');
}


function contadorCantidad() {
    $('.count').prop('disabled', true);

    $(document).on('click', '.plus', function () {
        var input = $(this).closest('tr').find('.count');

        var precio = $(this).closest('tr').find('.precio');
        var total = $(this).closest('tr').find('.total');

        const precioN =  parseInt(precio.text().replace(/[^0-9.-]+/g, '').replace('.', ''));
       
        input.val(parseInt(input.val()) + 1);
        var cantidad = parseInt(input.val());

        const totalFormato = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(parseInt(precioN) * cantidad);

        total.text(totalFormato);

  //agregar valor de primer registro
  // Obtener el texto actual del elemento #totalVenta
        const totalVentaTexto = $("#totalVenta").text();

// Eliminar el formato de moneda y convertirlo a un número
const venta =  parseInt(totalVentaTexto.replace(/[^0-9.-]+/g, '').replace('.', ''));

        // var venta=  parseInt($("#totalVenta").text());
        var totalV = venta+ parseInt( precioN);
        const totall = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(totalV);

            $("#totalVenta").text(totall);
      

    });

    $(document).on('click', '.minus', function () {
        var input = $(this).closest('tr').find('.count');
        var precio = $(this).closest('tr').find('.precio');
        var total = $(this).closest('tr').find('.total');

        const precioN =  parseInt(precio.text().replace(/[^0-9.-]+/g, '').replace('.', ''));
        const totalN =  parseInt(total.text().replace(/[^0-9.-]+/g, '').replace('.', ''));

        input.val(parseInt(input.val()) - 1);
        var cantidad = parseInt(input.val());
        if (input.val() <= 0) {
            input.val(1);
        }
        if (cantidad > 0) {

            const totalF = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(parseInt(totalN) - parseInt(precioN));
            total.text(totalF);
             //agregar valor de primer registro
             const totalVentaTexto = $("#totalVenta").text();

             // Eliminar el formato de moneda y convertirlo a un número
             const venta = parseInt(totalVentaTexto.replace(/[^0-9.-]+/g, '').replace('.', ''));

             
        var totalV =  venta - parseInt( precioN);
        const totall = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(totalV);

        $("#totalVenta").text(totall);
        }


    });
}

function cancelarPedido() {
    var tbody = $("#tabla tbody");
    if (tbody.find("tr").length != 0){
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta seguro de cancelar el Pedido ',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ae9243',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            var venta= 0;
            $("#totalVenta").text( venta);
         $('#tabla > tbody').empty();
              } else {
        
              }
    });

      
}   
     
}
function eliminarRegistroPedido(button) {
      //agregar valor de primer registro
      var total = $(button).closest('tr').find('.total');
      const totalVentaTexto = $("#totalVenta").text();
      // Eliminar el formato de moneda y convertirlo a un número
      const venta = parseInt(totalVentaTexto.replace(/[^0-9.-]+/g, '').replace('.', ''));
      const totalN = parseInt( total.text().replace(/[^0-9.-]+/g, '').replace('.', ''));

      
 var totalV = venta - parseInt(totalN);
 const totall = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(totalV);

      $("#totalVenta").text(totall);

      // Encuentra la fila (tr) a la que pertenece el botón y elimínala
    $(button).closest('tr').remove();
    
}

function confirmarVenta(){
    var tbody = $("#tabla tbody");
    if (tbody.find("tr").length != 0){
        Swal.fire({
            title: '¿Esta seguro de registrar esta venta?',
            // text: 'Su venta se registro con éxito ',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: ' #d5c429 ',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                var estadoNotificacion = $("#estadoPedidoVenta").val();
                if(estadoNotificacion != ""){
                    handleAjaxRequest(function (token) {
                        confirmarVentaNotificacion(estadoNotificacion, token);
                    });
                  
                }else{
                    var venta= 0;
                    $("#totalVenta").text( venta);
                    var pedido=[];
                    $('#tabla tbody tr').each(function() {
                        // Obtiene el ID de la fila, que parece estar en el formato 'tr-N'
                        var id = $(this).attr('id');
                        var partes = id.split('-');
                        id = partes[1];
                        // Obtiene los datos de cada columna en la fila
                        var producto = $(this).find('th:eq(0)').text();
                        var precio = $(this).find('th:eq(1)').text();
                        var cantidad = $(this).find('.count').val(); // Aquí se usa la clase 'count' del input
                        var total = $(this).find('.total').text();
                    
                        pedido.push({"idProducto": Number(id), "cantidad": Number(cantidad)});
                    });
                    var pedidoTotal={"pedido":pedido};
                    $("#cargando").modal("show");
                    handleAjaxRequest(function (token) {
                        callApiVentaBarra(pedidoTotal, token);
                    });
        
                }
             }
        });
    }

}

function callApiVentaBarra(pedidoTotal,token){
    $.ajax({
        type: "POST",
        url:hostDomain+"/edge-service/v1/service/venta/barra/crear",
        "headers": {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          "data": JSON.stringify(pedidoTotal),
          success: onExitoPedido,
          error: onErrorPedido
        });
}
function confirmarVentaNotificacion(idPedido,token){
    $.ajax({
        type: "POST",
        url:hostDomain+"/edge-service/v1/service/venta/barra/crear/"+idPedido,
        "headers": {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          data: JSON.stringify({ idPedido: idPedido }), // Convertir a JSON
          success: onExitoPedido,
          error: onErrorPedido
        });
}

function onExitoPedido(data){
    ocultarCargando();
    Swal.fire({
        title: 'Exito',
        text: 'La Venta fue realizada con exito',
        type: 'success',
        icon:"success",
       showCancelButton: true,
            confirmButtonColor: ' #d5c429 ',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Enviar a credito'
        }).then((result) => {
            if (result.isConfirmed) {
      handleAjaxRequest(consultarApiVentasPendientes);
        var venta= 0;
            $("#totalVenta").text( venta);
         $('#tabla > tbody').empty();
            }else{
                //aca de
                window.location = "./usuariocreditos.html"
            }
    });
}

function onErrorPedido(error){
    ocultarCargando();
    Swal.fire({
        title: 'Error',
        text: error.responseJSON.value.message,
        icon:"warning",
        showCancelButton: false,
        confirmButtonColor: ' #d5c429 ',
        confirmButtonText: 'Confirmar',
    }).then((result) => {
       
    });

}