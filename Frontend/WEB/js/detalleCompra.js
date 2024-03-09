const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let listData;
let listaProveedores;
let listaProductos;
handleAjaxRequest(consultarProductos);
handleAjaxRequest(consultarProveedores);//consulta proveedores y lo asigna a variable listaProveedores

function asignarValor(data) {
    listData = data;
}

$(document).ready(function () {
  const idCompra = urlParams.get('idCompra');
  if(idCompra != "Nuevo"){
  handleAjaxRequest(ObtenerDetalleCompra);
}
});

function ObtenerDetalleCompra(){
  var miTabla = $('#miTabla').DataTable({
    // ... otras opciones ...
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
    }
  });
  handleAjaxRequest(function (token) {
    callApiObtenerDetalleCompra(token,miTabla);
});
  // const apiUrl = `https://localhost:7084/api/DetalleCompra/ObtenerDetalleCompraPorIdCompra/${idCompra}`;
}
function callApiObtenerDetalleCompra(token,miTabla){
  const idCompra = urlParams.get('idCompra');
  $.ajax({
    url: `http://localhost:8081/edge-service/v1/service/detalle-compras/consultar/id/${idCompra}`, // Reemplaza '2' con el ID que necesites
    "headers": {
      'Authorization': `Bearer ${token}`
  },
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      // Limpia la tabla antes de agregar nuevos datos
      miTabla.clear();
      // Itera a través de los datos y agrégalos a la tabla
      $.each(data, function (index, item) {
        var acciones = '';
        acciones += '<button class="btn btn-editar" onclick="editDetail(' + item.idDetalleCompra + ')"><i class="fas fa-edit"></i></button>';
        acciones += '&nbsp;&nbsp;&nbsp;&nbsp'; // Agrega un espacio en blanco
        acciones += '<button class="btn btn-eliminar" onclick="deleteDetail(' + item.idDetalleCompra + ')"><i class="fas fa-trash"></i></button>';
        acciones += '</div>';

        miTabla.row.add([
          item.idDetalleCompra,
          item.producto,
          item.categoria,
          item.proveedor,
          item.cantidadProducto,
          '$ ' + item.precio.toLocaleString('es-CO'),
          '$ ' + item.subtotal.toLocaleString('es-CO'),
          acciones
        ]).draw();
      });
      asignarValor(data);
    },
    error: function (error) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon:"warning",
        showCancelButton: false,
        confirmButtonColor: ' #ae9243 ',
        confirmButtonText: 'Confirmar',
    }).then((result) => {
    });
    }
  });
}
// Resto del código y funciones se mantienen igual

// Función para manejar errores de la llamada a la API
function handleAPIError(error) {
  // console.error('Error al obtener los datos de la API:', error);
  Swal.fire({
    title: 'Error',
    text: error.message,
    icon:"warning",
    showCancelButton: false,
    confirmButtonColor: ' #ae9243 ',
    confirmButtonText: 'Confirmar',
}).then((result) => {
});

}

// Función para redirigir a la página de compras
function redirectToComprasPage() {
  const destinationURL = 'http://127.0.0.1:5500/compras.html';
  window.location.href = destinationURL;
}

// Función para crear un botón de acción (editar o eliminar)
function createButton(action, id) {
  const buttonText = (action === 'edit') ? 'Editar' : 'Eliminar';
  const iconClass = (action === 'edit') ? 'fas fa-edit' : 'fas fa-trash-alt';

  return `<button class="btn btn-warning d-inline col-6" onclick="${action}Detail(${id})">
              <i class="${iconClass}"></i> ${buttonText}
          </button>`;
}

  function deleteDetail(id) {
    Swal.fire({
      title: 'Confirma Eliminación',
      text: 'Estas seguro de eliminar este detalle de la compra?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ae9243',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        handleAjaxRequest(function (token) {
          callApiDeleteDetail(token,id);
      });
      } else {
      }
    });
  }
function callApiDeleteDetail(token,id){
  $.ajax({
    type: 'DELETE',
    url: 'http://localhost:8081/edge-service/v1/service/detalle-compras/eliminar/'+id,
    "headers": {
      'Authorization': `Bearer ${token}`
  },
    contentType: 'application/json',
    success: function (response) {
      window.location.reload();
    },
    error: function (error) {
      // Handle the error
      Swal.fire({
        title: 'Error',
        text: 'No es posible eliminar después de 24 horas.',
        icon: 'error',
        showConfirmButton: false,
        timer: 1500
      });
    }
  });
}
  function editDetail(id) {
    if (listData !== undefined) {
        listData.forEach(function(item) {
          if( parseInt(item.idDetalleCompra) == id){

            var selectElement = document.getElementById("idExistencias");
            listaProductos.forEach(function(p){
              if(p.idExistencias == item.idExistencias){
                selectElement.text = p.nombreProducto;
                selectElement.value =p.idExistencias;
              }
            });
            var selectProveedor = document.getElementById("proveedor");
            selectProveedor.text =item.proveedor;
            selectProveedor.value =item.idProveedor;

            var precio = document.getElementById("Precio");
            precio.value =item.precio;

            var cantidad = document.getElementById("Cantidad");
            cantidad.value =item.cantidadProducto;
            var idDc = document.getElementById("idDetalleCompra");
            idDc.value =item.idDetalleCompra;
            var accion = document.getElementById("optionEdit");
            accion.value = "edit"
          }
          });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'La variable aún no tiene un valor asignado.',
          icon:"warning",
          showCancelButton: false,
          confirmButtonText: 'Confirmar',
      }).then((result) => {
      });
      }
  }

  function limpiarFormulario(){
    var empty = "";

    var selectElement = document.getElementById("idExistencias");
    var opcionAEliminar = document.getElementById("opcionEdit");
    if (selectElement && opcionAEliminar) {
        selectElement.removeChild(opcionAEliminar);
    }
    $('#Cantidad').val(empty);
    $('#Precio').val(empty);
    $('#accion').val("add");
    $('#idDetalleCompra').val(empty);
    $('#idProveedores').val(empty);

  }
function nuevoDetalleCompra(){

    const idCompra = urlParams.get('idCompra');
    //console.log("nuevo detalle "+urlParams.get('idCompra'));
    if (idCompra != null) {
        const destinationURL = `http://127.0.0.1:5500/nuevaCompra.html?idCompra=${idCompra}`;
        window.location.href = destinationURL;
    }else{
      const destinationURL = `http://127.0.0.1:5500/compras.html`;
      window.location.href = destinationURL;
    }

}

function listExistenciaProductos(){
    const selectElement = document.getElementById("idExistencias");

    fetch("https://localhost:7084/Compras/listProducts")
    .then((response) => response.json())
    .then((data) => {
        // Iterate over the data and create <option> elements
        data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.idExistencias;
        option.textContent = item.nombreProducto;
        selectElement.appendChild(option); // Append the option to the <select>
        });
    })
    .catch((error) => {
        // console.error("Error fetching data:", error);
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon:"warning",
          showCancelButton: false,
          confirmButtonColor: ' #ae9243 ',
          confirmButtonText: 'Confirmar',
      }).then((result) => {
      });
    });

}

function crearDetalleCompra(){

    const idProveedores = document.getElementById("proveedor");
    const cantidadInput = document.getElementById("Cantidad");
    const precio = document.getElementById("Precio");
    const accion = document.getElementById("optionEdit");
    const idExistencias = accion=="edit"? document.getElementById("opcionEdit"): document.getElementById("idExistencias");
    const idCompra = urlParams.get('idCompra');
    const idDetalleCompra = document.getElementById("idDetalleCompra");

    var request=  {
        idCompra: idCompra,
        idExistencias: idExistencias.value,
        idProveedores: idProveedores.value,
        cantidadProducto: cantidadInput.value,
        precioCompra: precio.value,
        accion: accion.value,
        idDetalleCompra: idDetalleCompra.value=="" ? "0" : idDetalleCompra.value
        };

    //console.log("rq ",request);
    if (idCompra != null) {
      handleAjaxRequest(function (token) {
        ApiCallCrearDetalleCompra(token,request);
    });
    }else{
        const destinationURL = `http://127.0.0.1:5500/compras.html`;
        window.location.href = destinationURL;
    }
}
function ApiCallCrearDetalleCompra(token,request){
  $.ajax({
    type:request.accion=="edit"?"PUT":"POST",
    url:request.accion=="edit"?"http://localhost:8081/edge-service/v1/service/detalle-compras/actualizar/"+request.idDetalleCompra :"http://localhost:8081/edge-service/v1/service/detalle-compras/actualizar",
    "headers": {
      'Authorization': `Bearer ${token}`
  },
    data:JSON.stringify(request),
    contentType: "application/json",
    success: function(response) {
        // Procesar la respuesta exitosa
        limpiarFormulario();
        window.location.reload();
                 // Mostrar ventana de confirmación después de guardar
        Swal.fire({
          title: 'Guardado exitoso',
            text: 'Los cambios se han guardado correctamente.',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
        });
    },
    error: function(error) {
      const message = error.responseText === "No puedes editar o eliminar una compra después de 24 horas."?
      error.responseText : "Error con datos indicados";
        Swal.fire({
          title: 'Error',
          text: message,
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        });
    }
    });
}
function updateDetalleCompra(){

    const idProveedores = document.getElementById("proveedor");
    const cantidadInput = document.getElementById("Cantidad");
    const precio = document.getElementById("Precio");
    const idExistencias = accion=="edit"? document.getElementById("opcionEdit"): document.getElementById("idExistencias");
    const idCompra = urlParams.get('idCompra');
    const idDetalleCompra = document.getElementById("idDetalleCompra");

    var request= JSON.stringify( {
        idCompra: idCompra,
        idExistencias: idExistencias.value,
        idProveedores: idProveedores.value,
        cantidadProducto: cantidadInput.value,
        precioCompra: precio.value,
        idDetalleCompra: idDetalleCompra.value=="" ? "0" : idDetalleCompra.value
        });

    //console.log("rq ",request);

    if (idCompra != null) {
      handleAjaxRequest(function (token) {
        callApiUpdateDetalleCompra(request,token);
    });
    }else{
        const destinationURL = `http://127.0.0.1:5500/compras.html`;
        window.location.href = destinationURL;
    }
}
function callApiUpdateDetalleCompra(request,token){
  $.ajax({
    type: "POST",
    url: "http://localhost:8081/edge-service/v1/service/detalle-compras/actualizar",
    "headers": {
      'Authorization': `Bearer ${token}`
  },
    data: request,
    contentType: "application/json",
    success: function(response) {
        // Procesar la respuesta exitosa
        alert("rs"+JSON.stringify(response));s
        // Mostrar ventana de confirmación después de guardar
        Swal.fire({
          title: 'Guardado exitoso',
          text: 'Los cambios se han guardado correctamente.',
          icon: 'success',
          timer: 1500
        });

        limpiarFormulario();
        window.location.reload();
    },
    error: function(error) {
        Swal.fire({
          title: 'Error',
          text: error.message,
          icon:"warning",
          showCancelButton: false,
          confirmButtonText: 'Confirmar',
      }).then((result) => {
      });
    }
    });
}
function confirmarYGuardarDetalleCliente() {
  Swal.fire({
    title: 'Confirmación',
    text: '¿Estás seguro de que deseas guardar los cambios?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#ae9243',
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Sí, guardar'
  }).then((result) => {
    if (result.isConfirmed) {
      crearDetalleCompra();

    }else if(result.dismiss === Swal.DismissReason.cancel){
      Swal.fire({
        title: "Cancelado",
        text: "Su compra ha sido cancelada :)",
        icon: "error"
      });
    }
  });
}

//consultar productos

function consultarProductos(token) {
  console.log("esto se llama?");

  $.ajax({
      type: "GET",
      url: "http://localhost:8081/edge-service/v1/service/productos/existencias",
      "headers": {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json"
        },
      success: onExitoProductosList,
      error: onErrorProductosList
  });
}

function onExitoProductosList(data) {

  listaProductos= data;
  console.log("productos: " + JSON.stringify(listaProductos));

  var select = $("#idExistencias");
    select.empty();
    select.append('<option value="">Seleccione...</option>');
    listaProductos.forEach(function(producto) {
        select.append('<option value="' + producto.idExistencias + '">' + producto.nombreProducto + '</option>');
    });
}

function onErrorProductosList(error) {
  Swal.fire({
    title: 'Error',
    text: error.message,
    icon:"warning",
    showCancelButton: false,
    confirmButtonText: 'Confirmar',
}).then((result) => {
});
}


//consulta proveedores
function consultarProveedores(token) {
  $.ajax({
      type: "GET",
      url: "http://localhost:8081/edge-service/v1/service/proveedor/consultar",
      "headers": {
        'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      success: onExitoProveedorList,
      error: onErrorProveedorList
  });
}

function onExitoProveedorList(data) {
  listaProveedores =data;
listarProveedor();
}

function onErrorProveedorList(error) {
  Swal.fire({
    title: 'Error',
    text: error.message,
    icon:"warning",
    showCancelButton: false,
    confirmButtonText: 'Confirmar',
}).then((result) => {
});
}

function listarProveedor() {
  var select = $("#proveedor");

  // Limpiar opciones existentes
  select.empty();

  // Agregar opción predeterminada
  select.append('<option value="">Seleccione...</option>');

  // Agregar opciones desde la lista
  listaProveedores.forEach(function(proveedor) {
      select.append('<option value="' + proveedor.idProveedores + '">' + proveedor.nombre + '</option>');
  });

}
