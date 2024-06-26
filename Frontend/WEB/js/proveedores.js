$(document).ready(function() {
  $("#inputBusqueda").on("input", function() {
    var idProveedor = $(this).val();

    handleAjaxRequest(function (token) {
      buscarDatos(idProveedor,token);
  });
    // buscarDatos(idProveedor);
  });
});

function buscarDatos(idProveedor, token) {
  $.ajax({
    type: "GET",
    url: hostDomain+"/edge-service/v1/service/proveedor/consultar",
    "headers":{
        'Authorization': `Bearer ${token}`,
  },
    data: { query: idProveedor },
    dataType: "json",
    success: function(response) {
      // Procesar la respuesta exitosa
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

//función para eliminar o editar proveedor
function alertaEliminarEditar(action,idProveedor) {
    if (action=="eliminar"){
      handleAjaxRequest(function (token) {
        eliminarProveedor(idProveedor,token);
    });
      // eliminarProveedor(idProveedor);
    }else if (action=="editar"){
    handleAjaxRequest(function (token) {
      consultarProveedor(idProveedor,token);
  });
      // consultarProveedor(idProveedor);
    }
}

function consultarProveedor(idProveedor, token) {

    $.ajax({
        type: "GET",
        url:hostDomain+"/edge-service/v1/service/proveedor/consultar/id/" + idProveedor,
        "headers": {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
          success: function (data){
          $("#documentoE").val(data.documento);
          $("#nombreE").val(data.nombre);
          $("#emailE").val(data.email);
          $("#telefonoE").val(data.telefono);
          $("#direccionE").val(data.direccion);
          $("#idProveedorE").val(idProveedor);
        },
        error: function (error){
            var mensaje = $("#resultadoCrear");
              mensaje.addClass("alert-danger");
              mensaje.removeClass("alert-success");
              mensaje.show();
              mensaje.text(error.message);
        }
    });
}

//Ajax para eliminar proveedor
function eliminarProveedor(idProveedor, token) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Está seguro de eliminar el proveedor '+ idProveedor +'?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ae9243',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Realizar la solicitud de eliminación AJAX
            const xhr = new XMLHttpRequest();
            const pathDelete = hostDomain+"/edge-service/v1/service/proveedor/eliminar/id/" + idProveedor;
            xhr.open("DELETE", pathDelete, true);
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
            xhr.onload = function () {
              if (xhr.status === 200) {
              Swal.fire({
                type: 'success',
                icon:"success",
                text: 'El proveedor ha sido eliminado. ',
                showConfirmButton: false,
                timer: 1500
              })
              setTimeout(() => {
                window.location.reload();
              }, 1500);

              } else {
                Swal.fire('Error', error.message, 'error');
              }
            };
            xhr.send();
        }
    });
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
      handleAjaxRequest(function (token) {
        callApiEditarProveedor(data,token);
    });
}

function callApiEditarProveedor(data,token){

  $.ajax({
    type: "PUT",
    url: hostDomain+"/edge-service/v1/service/proveedor/actualizar/id/" + $("#idProveedorE").val(),
    "headers": {
      'Authorization': `Bearer ${token}`
    },
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function(response) {
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
      Swal.fire({
        type: 'error',
        text: "No se actualizó el registro",
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
  handleAjaxRequest(callApiConsultarProveedor);
  // callApiConsultarProveedor(token)

});

function callApiConsultarProveedor(token) {
  $.ajax({
    url: hostDomain+'/edge-service/v1/service/proveedor/consultar',
    "headers": {
      'Authorization': `Bearer ${token}`
    },
    success: function(data) {

      // Verificar si hay datos en la respuesta
      if (data && data.length > 0) {

        // Inicializar DataTables después de agregar los datos
        iniciarDataTables(data);

      } else {
        iniciarDataTables();
      }
    },
    error: function(xhr, error, thrown) {
          Swal.fire({
            title: 'Error',
            text: xhr.responseText,
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
  if ($.fn.DataTable.isDataTable('#miTabla')) {
    $('#miTabla').DataTable().destroy();
  }
  var dataTable = $('#miTabla').DataTable({
    dom: '<"row"<"col-md-6"l><"col-md-6"f>>tip',
    pageLength: 5,
    lengthMenu: [5, 10, 25, 50],

    rowId: 'idProveedores',

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
    },
  });

// Seleccionar el elemento de búsqueda
var inputSearch = $('#miTabla_filter input');
inputSearch.removeAttr('form-control'); // Asegurarse de que el input tenga la clase form-control
inputSearch.removeAttr('placeholder'); // Quitar el atributo placeholder si existe

dataTable.clear();

$.each(data, function (id, productos) {

var boton1 ='<button class="btn btn-editar" data-toggle="modal" data-target="#miModal" onclick="alertaEliminarEditar(\'editar\', ' + productos.idProveedores + ')"><i class="fa-solid fa-user-pen"></i></button>';
var espacio = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
var boton2 = '<button onclick="alertaEliminarEditar(\'eliminar\', ' + productos.idProveedores + ')" class="btn btn-eliminar" > <i class="fa-solid fa-trash-can"></i></button>';

// Agrega la fila a la DataTable
dataTable.row.add([
    productos.documento,
    productos.nombre,
    productos.email,
    productos.telefono,
    productos.direccion,
    boton1 + espacio +boton2
]).draw();

});

}
// Function to create a table row with the given data
function createTableRow(data) {
  const row = document.createElement("tr");

  // Iterate over each property in the data object
  const propertyOrder = ["idProveedores", "documento", "nombre","email","telefono","direccion"];

  for (const property of propertyOrder) {
    if (data.hasOwnProperty(property)) {
      const cell = document.createElement("td");
      cell.textContent = data[property];
      row.appendChild(cell);
    }
  }

  // Añadir la celda del botón de edición
  const editCell = document.createElement("td");
  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.setAttribute("data-toggle", "modal");
  editButton.setAttribute("data-target", "#miModal");
  editButton.className = "btn btn-warning d-inline";
  editButton.onclick = function() {
    alertaEditar('editar', data.idProveedores);
  };
  const editIcon = document.createElement("svg");
  editIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  editIcon.setAttribute("width", "16");
  editIcon.setAttribute("height", "16");
  editIcon.setAttribute("fill", "currentColor");
  editIcon.setAttribute("class", "fa fa-edit");
  editIcon.setAttribute("viewBox", "0 0 16 16");
  const editPath = document.createElement("path");
  editPath.setAttribute("d", "m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z");
  editIcon.appendChild(editPath);
  editButton.appendChild(editIcon);
  editButton.onclick = function() {
      alertaEliminarEditar('editar', data.idProveedores);
    };
  editCell.appendChild(editButton);
  row.appendChild(editCell);

  // Add the delete button cell
  const deleteCell = document.createElement("td");
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "btn btn-warning d-inline";
  deleteButton.onclick = function() {
    alertaEliminarEditar('eliminar', data.idProveedores);
  };
  const deleteIcon = document.createElement("i");
  deleteIcon.className = "fa fa-trash";
  deleteIcon.setAttribute("aria-hidden", "true");
  deleteButton.appendChild(deleteIcon);
  deleteCell.appendChild(deleteButton);
  row.appendChild(deleteCell);

  return row;
}
//logica para crear proveedor
function onExitoCrearProveedor(data) {
  Swal.fire({
      type: 'success',
      text: 'Registro guardado.',
      icon: "success",
      showConfirmButton: false,
      timer: 1500
  });

  setTimeout(() => {
      window.location.reload();
  }, 1500);
}

  function onErrorProv(error) {
      // Display the error using SweetAlert2
      Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message || 'Ocurrió un error inesperado.',
      });
  }

function crearUsuarioProveedor() {
  var formData = {
      nombre: $("#nombre").val(),
      documento: $("#documento").val(),
      email: $("#email").val(),
      telefono: $("#telefono").val(),
      direccion: $("#direccion").val(),
  };

  if (validarCampoVacio($("#nombre").val().length, 'Por favor ingrese un nombre')) {
      return false;
  }
  if (validarCampoVacio($("#documento").val().length, 'Por favor ingrese documento')) {
      return false;
  }
  if (validarCampoVacio($("#email").val().length, 'Por favor ingrese email')) {
      return false;
  }
  if (validarCampoVacio($("#telefono").val().length, 'Por favor ingrese teléfono')) {
      return false;
  }
  if (validarCampoVacio($("#direccion").val().length, 'Por favor ingrese dirección')) {
      return false;
  }

  handleAjaxRequest(function (token) {
    callApiCrearProveedor(formData,token);

});
}
function callApiCrearProveedor(formData,token){
  $.ajax({
    type: "POST",
    url: hostDomain+"/edge-service/v1/service/proveedor/crear",
    "headers": {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
    },
    "data": JSON.stringify(formData),
    success: onExitoCrearProveedor,
    error: onErrorProv

});
}