$(document).ready(function() {
  handleAjaxRequest(callApiConsultarCompra);
  });

function addCompra() {
    //window.location.href = 'comprasDetail.html';
    handleAjaxRequest(callApiAddCompra);
    console.log("invoking API");
  }
function callApiAddCompra(token){
  $.ajax({
    type: "GET",
    url: hostDomain+"/edge-service/v1/service/compras/consultar/1090208030",
    "headers": {
      'Authorization': `Bearer ${token}`
  },
    contentType: "application/json",
    success: function(response) {
      // Procesar la respuesta exitosa
      habilitarVistaDetalle(response.idCompra+1);
      //window.location.reload();
    },
    error: function(error) {
      // Manejar el error
      Swal.fire({
        title: 'Error',
        text: error.responseJSON.message,
        icon:"warning",
        showCancelButton: false,
        confirmButtonColor: ' #ae9243 ',
        confirmButtonText: 'Confirmar',
    }).then((result) => {
    });
    }
  });
}

  function deleteCompra(idCompra) {
    // Display a confirmation dialog using SweetAlert
    Swal.fire({
      title: 'Confirma Eliminación',
      text: 'Estás seguro de eliminar esta Compra?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ae9243',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked "Yes," proceed with the API call
        handleAjaxRequest(function (token) {
          callAPiDeleteCompra(idCompra,token);
  });

      } else {
        // User clicked "Cancel" or closed the dialog, do nothing
      }
  });
}
function callAPiDeleteCompra(idCompra,token){
  $.ajax({
    type: 'DELETE',
    url: `${hostDomain}/edge-service/v1/service/compras/eliminar/${idCompra}`,
    "headers": {
      'Authorization': `Bearer ${token}`
  },
    contentType: 'application/json',
    success: function (response) {
      // Procesar la respuesta exitosa
      window.location.reload();
    },
    error: function (error) {
      // Manejar el error
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
function generarPDF(){
handleAjaxRequest(callApiGenerarPdf);
}
function callApiGenerarPdf(token){
  $.ajax({
    type: "GET",
    url: hostDomain+"/edge-service/v1/service/compras/consultar/pdf",
    "headers": {
      'Authorization': `Bearer ${token}`,
      'target' : 'pdf'
  },
    xhrFields: {
      responseType: 'arraybuffer' // Indica que esperamos un array de bytes como respuesta
    },
    success: function (response, status, xhr) {
      if (xhr.status === 200) {
        // Crea un objeto Blob con la respuesta y tipo de contenido PDF
        const blob = new Blob([response], { type: 'application/pdf' });

        // Crea una URL de objeto para el blob
        const blobURL = URL.createObjectURL(blob);

        // Crea un enlace invisible para descargar el PDF
        const link = document.createElement('a');
        link.href = blobURL;
        link.download = 'Compras.pdf'; // Puedes cambiar el nombre del archivo si es necesario
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Libera la URL de objeto después de unos segundos (puedes ajustar el tiempo)
        setTimeout(() => {
          URL.revokeObjectURL(blobURL);
        }, 5000); // 5000 milisegundos (5 segundos) como ejemplo
      } else {
        Swal.fire({
          title: 'Error',
          text: `Error en la respuesta del servidor. Código de estado: ${xhr.status}`,
          icon:"warning",
          showCancelButton: false,
          confirmButtonColor: ' #ae9243 ',
          confirmButtonText: 'Confirmar',
      }).then((result) => {
      });
      }
    },
    error: function (error) {
      // Manejar el error
      Swal.fire({
        title: 'Error',
        text: 'Error en la respuesta',
        icon:"warning",
        showCancelButton: false,
        confirmButtonColor: ' #ae9243 ',
        confirmButtonText: 'Confirmar',
    }).then((result) => {
    });
    }
  });
}

  function habilitarVistaDetalle(idCompra){
    const destinationURL = `comprasDetail.html?idCompra=${idCompra}`;
    window.location.href = destinationURL;
  }

// Function to create a table row with the given data
function createTableRow(data) {
  // Crear una fila
  const row = document.createElement("tr");

  // Orden de las propiedades que se mostrarán en las columnas
  const propertyOrder = ["idCompra", "fechaCompra", "totalCompra"];

  // Iterar sobre cada propiedad en el objeto de datos
  for (const property of propertyOrder) {
    if (data.hasOwnProperty(property)) {
      // Crear una celda para cada propiedad
      const cell = document.createElement("td");
      cell.textContent = data[property];
      row.appendChild(cell);
    }
  }

  // Añadir la celda del botón de edición
  const editCell = createButtonCell("edit", "Editar", "btn-warning", function() {
    habilitarVistaDetalle(data["idCompra"]);
  });
  row.appendChild(editCell);

  // Añadir la celda del botón de eliminación
  const deleteCell = createButtonCell("delete", "Eliminar", "btn-danger", function() {
    deleteCompra(data["idCompra"]);
  });
  row.appendChild(deleteCell);

  return row;
}

// Función para crear una celda de botón
function createButtonCell(action, buttonText, buttonClass, onClickHandler) {
  const buttonCell = document.createElement("td");
  const button = document.createElement("button");
  button.type = "button";
  button.className = `btn ${buttonClass} d-inline`;
  button.textContent = buttonText;

  // Asignar el manejador de clic al botón
  button.onclick = onClickHandler;

  buttonCell.appendChild(button);
  return buttonCell;
}



//función para eliminar o editar proveedor
function alertaEliminarEditar(action,idProveedor) {

    if (action=="eliminar"){
        eliminarProveedor(idProveedor);
    }else if (action=="editar"){
        consultarProveedor(idProveedor);
    }
}


function callApiConsultarCompra(token){
  $.ajax({
    url: hostDomain+'/edge-service/v1/service/compras/consultar',
    "headers": {
      'Authorization': `Bearer ${token}`
  },
    success: function(data) {
      // Verificar si hay datos en la respuesta
      if (data && data.length > 0) {

        // Inicializar DataTables después de agregar los datos
        iniciarDataTables(data);
      } else {
        Swal.fire({
          title: 'Error',
          text: 'No hay datos en la respuesta',
          icon:"warning",
          showCancelButton: false,
          confirmButtonColor: ' #ae9243 ',
          confirmButtonText: 'Confirmar',
      }).then((result) => {
      });
        //iniciarDataTables();
      }
    },
    error: function(xhr, error, thrown) {
      Swal.fire({
        title: 'Error',
        text: 'Respuesta de la API:'+ xhr.responseText,
        icon:"warning",
        showCancelButton: false,
        confirmButtonColor: ' #ae9243 ',
        confirmButtonText: 'Confirmar',
    }).then((result) => {
    });
    }
  });
}
// Inicializar DataTables directamente después de la carga de la página
function iniciarDataTables(data) {
      var dataTable = $('#miTabla').DataTable({
        dom: '<"row"<"col-md-6"l><"col-md-6"f>>tip',
        pageLength: 5,
        lengthMenu: [5, 10, 25, 50],
        rowId: 'idCompra',
        language: { /*language, parametro adicional para cambiar los texto del datatable */
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
          "sSortDescending": ": Activar para ordenar la columna de manera descendente",
          "sSortAscending": ": Activar para ordenar la columna de manera ascendente"
          }
        },
      });
      // Seleccionar el elemento de búsqueda
      var inputSearch = $('#miTabla_filter input');
        inputSearch.removeAttr('form-control'); // Asegurarse de que el input tenga la clase form-control
        inputSearch.removeAttr('placeholder'); // Quitar el atributo placeholder si existe
        dataTable.clear();
      $.each(data, function (id, proveedor) {
        var boton1 ='<button class="btn btn-editar" data-toggle="modal" data-target="#miModal" onclick="habilitarVistaDetalle(' + proveedor.idCompra + ')"><i class="fa-solid fa-eye"></i></button>';
        var espacio = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        var boton2 = '<button onclick="deleteCompra( ' + proveedor.idCompra + ')" class="btn btn-eliminar" > <i class="fa-solid fa-trash-can"></i></button>';
         // Agrega la fila a la DataTable
        dataTable.row.add([
          proveedor.idCompra,
          proveedor.fechaCompra.slice(0,-9),
          '$ '+proveedor.totalCompra.toLocaleString("es-CO"),
          boton1 + espacio + boton2
        ]).draw();
      });
    }
