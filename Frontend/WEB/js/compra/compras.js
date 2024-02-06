$(document).ready(function () {
  $("#resultadoCrear").hide();
  consultarcompra();
  consultarProductos();
  console.log("consultando productos");
});

function consultarcompra() {
  $.ajax({
      type: "GET",
      url: "https://localhost:7084/api/Compras",
      headers: {
          "Content-Type": "application/json"
      },
      success: onExitocompra,
      error: onErrorcompra
  });
}

function onErrorcompra(error) {
  console.error('Error en la solicitud AJAX:', error);
}

function onExitocompra(data) {
  console.log("consulta de compras");
  console.log(data);

  $('#tablaCompra > tbody').empty();

  // Iterar sobre los datos de compras
  $.each(data, function (id, compras) {

    var boton1 = "<button onclick='("+ JSON.stringify(compras) +")' class='btn btn-delete' data-id='1'><i class='fas fa-trash'></i></button>";
    var boton2 = "<button onclick='("+ JSON.stringify(compras) +")' class='btn btn-edit' data-toggle='modal' data-target='#'><i class='fas fa-edit'></i></button>";

    $('#tablaCompra').append('<tr><td>' + compras.idCompra + '</td><td>' + compras.fechaCompra+
    '</td><td>' + compras.totalCompra+ '</td><td>' + boton2 + '</td><td>' + boton1 + '</td></tr>');
    console.log(compras.idCompra + ' ' + compras.fechaCompra + ' ' + compras.totalCompra);
  });
}

function consultarProductos() {
  $.ajax({
      type: "GET",
      url: "https://localhost:7084/api/Productos",
      "headers": {
          "Content-Type": "application/json"
        },
      success: onExitoProductosList,
      error: onErrorProductosList
  });
}

function onExitoProductosList(data) {
  console.log(data);
  var $dropdown = $("#idProductos");

  // Limpiar las opciones existentes
  $dropdown.empty();

  // Agregar las opciones de roles desde la respuesta del servidor
  $.each(data, function () {
      $dropdown.append($("<option />").val(this.idProductos).text(this.nombreProducto));
  });

  // Seleccionar automáticamente el primer rol si hay roles disponibles
  if (data.length > 0) {
      $("#idProductos").val(data[0].idProductos);
  }
}



function onErrorProductosList(error) {
  console.log(error)
}
