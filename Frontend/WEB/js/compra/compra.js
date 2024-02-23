console.log("cargando scripts compras");

function addCompra() {
    console.log(new Date().getTime() + ' fecha' );
    //window.location.href = 'comprasDetail.html';

    $.ajax({
      type: "GET",
      url: "https://localhost:7084/api/Compra/1090208030",
      contentType: "application/json",
      success: function(response) {
        // Procesar la respuesta exitosa
        console.log("getLast ",response);
        habilitarVistaDetalle(response.idCompra+1);
        //window.location.reload();
      },
      error: function(error) {
        // Manejar el error
        console.log(error);
      }
    });
  }

  function deleteCompra(idCompra) {
    console.log("deleteCompra ",idCompra);
    // Display a confirmation dialog using SweetAlert
    Swal.fire({
      title: 'Confirma Eliminación',
      text: 'Estás seguro de eliminar esta Compra?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked "Yes," proceed with the API call
        $.ajax({
          type: 'DELETE',
          url: `https://localhost:7084/api/Compra/${idCompra}`,
          contentType: 'application/json',
          success: function (response) {
            // Procesar la respuesta exitosa
            console.log(response);
            window.location.reload();
          },
          error: function (error) {
            // Manejar el error
            console.log(error);
            Swal.fire({
              title: 'Error',
              text: 'No es posible eliminar después de 24 horas.',
              icon: 'error',
              showConfirmButton: false,
              timer: 1500
            });
          }
        });
      } else {
        // User clicked "Cancel" or closed the dialog, do nothing
      }
   });
}

function generarPDF(){
  console.log("esto funciona¡");
  $.ajax({
    type: "GET",
    url: "https://localhost:7084/api/Compra/GenerarPDF",
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
        console.error(`Error en la respuesta del servidor. Código de estado: ${xhr.status}`);
      }
    },
    error: function (error) {
      // Manejar el error
      console.error("Error en la solicitud:", error);
    }
  });
}

  function habilitarVistaDetalle(idCompra){
    const destinationURL = `http://127.0.0.1:5500/Frontend/WEB/comprasDetail.html?idCompra=${idCompra}`;
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
    console.log("id "+idProveedor   +" la acción que usd eligió es "+action);
    if (action=="eliminar"){
        eliminarProveedor(idProveedor);
    }else if (action=="editar"){
        consultarProveedor(idProveedor);
    }
}


//Ajax para editar Proveedor
function editarProveedor() {

    var data = {
        nombre: $("#nombreE").val(),
        documento: $("#documentoE").val(),
        telefono: $("#telefonoE").val(),
        direccion: $("#direccionE").val(),
        email: $("#emailE").val()
      };
    console.log(data);


  $.ajax({
    type: "PUT",
    url: "http://localhost:8080/api/proveedor/actualizar/" + $("#idProveedorE").val(),
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function(response) {
      console.log(response);
      Swal.fire({
        type: 'success',
        text: 'Registro actualizado',
        icon:"success",
        showConfirmButton: false,
        timer: 1500
      })
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    },
    error: function(error) {
      console.log(error);
      Swal.fire({
        type: 'error',
        text: "No se pudo actualizar registro",
        icon: 'error',
        showConfirmButton: false,
        timer: 1500
      })
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  });
}


$(document).ready(function() {
  $.ajax({
    url: 'https://localhost:7084/api/Compra',
    success: function(data) {
      console.log('Datos consultados:', data);

      // Verificar si hay datos en la respuesta
      if (data && data.length > 0) {
        console.log('consulta de servicio');

        // Agregar los datos directamente al tbody
        const tableBody = $('#tbody_compras');
        data.forEach(function(item) {
          const row = createTableRow(item);
          tableBody.append(row);
        });

        // Inicializar DataTables después de agregar los datos
        iniciarDataTables();
      } else {
        console.log('No hay datos en la respuesta.');
        //iniciarDataTables();
      }
    },
    error: function(xhr, error, thrown) {
      console.log('Error al obtener datos:', error);
      console.log('Respuesta de la API:', xhr.responseText);
    }
  });

  // Inicializar DataTables directamente después de la carga de la página
  function iniciarDataTables(data) {
    console.log("Iniciar DataTables");
    $('#miTabla').DataTable({
      dom: '<"row"<"col-md-6"l><"col-md-6"f>>tip',
      data: data,
      columns: [
      
         { data: 'idCompra' },
        { data: 'fechaCompra' },
        { data: 'totalCompra' },
        {
          data: null,
          render: function(data, type, row) {
            return '<button class="btn btn-editar" data-toggle="modal" data-target="#miModal" onclick="habilitarVistaDetalle( ' + row.idCompra + ')"><i class="fa fa-edit"></i></button>';
          }
        },
        {
          data: null,
          render: function(data, type, row) {
            return '<button onclick="deleteCompra(' + row.idCompra + ')" class="btn btn-eliminar" > <i class="fa fa-trash"></i></button>';
          }
        }
      ],
      columnDefs: [
        {
          targets: 0,
          visible: false
        }
      ],
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
          "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
          "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        }
      }
    });
  }
});
