var categorias;
var productos;


$(document).ready(function () {
    $("#cargando").modal("show");
     handleAjaxRequest(consultarCategorias)
    selectCategoria();
    contadorCantidad();
});


function consultarCategorias(token) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8081/edge-service/v1/service/categorias/consultar",
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
    console.log(data);
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
    console.log(error)
    $("#cargando").modal("hide");
}


function consultarProductosAgrupados(categorias,token) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8081/edge-service/v1/service/productos/consultar/agrupados",
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
    console.log(data);
    mostrarProductos(data, categorias);
    $("#cargando").modal("hide");
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
            var imagen = $("<img>").addClass("card-img-top").css("background-color", "rgba(77, 76, 97, 0.28)").attr("src","http://localhost:8080/"+ producto.foto).attr("width", "100").attr("alt", "Producto");
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
    console.log(error)
    $("#cargando").modal("hide");
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
        var venta=  parseInt($("#totalVenta").text());
        $("#totalVenta").text(referencia.precio + venta);
}

function existeIdEnTabla(id) {
    return $("#tabla tbody tr#tr-" + id).length > 0;
}

function mostrarProductosTabla(nombre, precio, idProducto) {
    var botonEliminar = ' <th><button class="btn btn-danger"  onclick="eliminarRegistroPedido(this)"><i class="fas fa-trash-alt"></i></button></th>';
    var nombreProducto = ' <th>' + nombre + '</th>';
    var precioProducto = ' <th class="precio">' + precio + '</th>';
    var cantidadBoton = '<th><div class="quantity">'
        + '<div class="qty">'
        + ' <span class="minus bg-dark">-</span>'
        + '<input type="number" class="count" name="qty" value="1">'
        + ' <span class="plus bg-dark">+</span>'
        + '</div>' +
        '</div></th>';

    var totalProductos = ' <th class="total">' + precio + '</th>';
    $('#tabla').append('<tr id="tr-' + idProducto + '" >' + nombreProducto + precioProducto + cantidadBoton + totalProductos + botonEliminar + '</tr>');
}


function contadorCantidad() {
    $('.count').prop('disabled', true);

    $(document).on('click', '.plus', function () {
        var input = $(this).closest('tr').find('.count');

        var precio = $(this).closest('tr').find('.precio');
        var total = $(this).closest('tr').find('.total');


        input.val(parseInt(input.val()) + 1);
        var cantidad = parseInt(input.val());

        total.text(parseInt(precio.text()) * cantidad);

  //agregar valor de primer registro
        var venta=  parseInt($("#totalVenta").text());
        $("#totalVenta").text( venta+ parseInt( precio.text()));

    });

    $(document).on('click', '.minus', function () {
        var input = $(this).closest('tr').find('.count');
        var precio = $(this).closest('tr').find('.precio');
        var total = $(this).closest('tr').find('.total');

        input.val(parseInt(input.val()) - 1);
        var cantidad = parseInt(input.val());
        if (input.val() <= 0) {
            input.val(1);
        }
        if (cantidad > 0) {
            total.text(parseInt(total.text()) - parseInt(precio.text()));
             //agregar valor de primer registro
        var venta=  parseInt($("#totalVenta").text());
        $("#totalVenta").text( venta- parseInt( precio.text()));
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
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
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
      var venta=  parseInt($("#totalVenta").text());
      $("#totalVenta").text( venta - parseInt( total.text()));

      // Encuentra la fila (tr) a la que pertenece el botón y elimínala
    $(button).closest('tr').remove();
}

// function despacharCredito(){
//     Swal.fire({
//         title: 'Lo sentimos!',
//         text: 'Esta funcionalidad se encuentra en construcción ',
//         icon: 'warning',
//         showCancelButton: false,
//         confirmButtonColor: ' #d5c429 ',
//         confirmButtonText: 'Confirmar',
      
//     }).then((result) => {
       
//     });

// 

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
            var venta= 0;
            //Hacer el llamado al api
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
            
                // Hacer lo que desees con los datos, por ejemplo, imprimirlos en la consola
                console.log('ID: ' + id);
                console.log('Producto: ' + producto);
                console.log('Precio: ' + precio);
                console.log('Cantidad: ' + cantidad);
                console.log('Total: ' + total);
                pedido.push({"idProducto":id, "cantidad":cantidad});
              });
              var pedidoTotal={"pedido":pedido};
              console.log(pedidoTotal);
              handleAjaxRequest(function (token) {
                callApiVentaMesa(pedidoTotal, token);
            });
             
              } else {
              }
    });
}
}
function callApiVentaMesa(pedidoTotal,token){
    $.ajax({
        type: "POST",
        url:"http://localhost:8081/edge-service/v1/service/venta/mesa/crear",
        "headers": {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          "data": JSON.stringify(pedidoTotal),
          success: onExitoPedido,
          error: onErrorPedido
          
    });

}

function onExitoPedido(data){
    console.log(data)
    Swal.fire({
        title: 'Exito',
        text: 'El pedido fue enviado con exito',
        type: 'success',
        icon:"success",
        showCancelButton: false,
        confirmButtonColor: ' #d5c429 ',
        confirmButtonText: 'Confirmar',
    }).then((result) => {
       
    });
}

function onErrorPedido(error){
    console.log(error.responseJSON.value)   
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
