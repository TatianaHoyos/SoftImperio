$(document).ready(function() {
  $("#inputBusqueda").on("input", function() {
    var idProveedor = $(this).val();

    buscarDatos(idProveedor);
  });
});

function buscarDatos(idProveedor) {
  $.ajax({
    type: "GET",
    url: "http://localhost:8080/api/proveedorconsultar/",

    data: { query: idProveedor },
    dataType: "json",
    success: function(response) {
      // Procesar la respuesta exitosa
      console.log(response);
    },
    error: function(error) {
      // Manejar el error
      console.log(error);
    }
  });
}


//función para eliminar o editar proveedor
function alertaEliminarEditar(action,idProveedor) {
    console.log("id "+idProveedor   +" la acción que usd eligió es "+action);
    if (action=="eliminar"){
        eliminarProveedor(idProveedor);
    }else if (action=="editar"){
        consultarProveedor(idProveedor);
       // $("#documentoE").val("New Value");
        
        // Create an FormData object 
        //var formData = new FormData(form);
        //editarProveedor(idProveedor);
    }
}    

function consultarProveedor(idProveedor) { 
    console.log("prueba"+idProveedor); 

    $.ajax({
        type: "GET",
        url:"http://localhost:8080/api/proveedorconsultar/"+idProveedor,
        "headers": {
            "Content-Type": "application/json"
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
            console.log(error);
          /*  var mensaje = $("#resultadoCrear");
            mensaje.addClass("alert-danger");
            mensaje.removeClass("alert-success");
            mensaje.show();
            mensaje.text(error.message);*/
        }
    });
}


//Ajax para eliminar proveedor
function eliminarProveedor(idProveedor) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta seguro de eliminar el proveedor '+ idProveedor,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Realizar la solicitud de eliminación AJAX
            const xhr = new XMLHttpRequest();
            const pathDelete = "http://localhost:8080/api/proveedor/eliminar/"+idProveedor;
            xhr.open("DELETE", pathDelete, true);
            
            xhr.onload = function () {
              if (xhr.status === 200) {
               console.log("Se eliminó proveedor con id"+idProveedor);
               Swal.fire({
                type: 'success',
                icon:"success",
                text: 'Eliminado ',
                showConfirmButton: false,
                timer: 2000
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
  
    // Add the edit button cell
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
  

  // AJAX request para consultar proveedores
  console.log("archivo consultas.js working");
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:8080/api/proveedorconsultar", true);
  
  xhr.onload = function () {
    if (xhr.status === 200) {

      const responseData = JSON.parse(xhr.responseText);
      const tableBody = document.getElementById("tbodyProveedores");
  
      // Iterate over each object in the response data array
      responseData.forEach(function (item) {
        const row = createTableRow(item);
        tableBody.appendChild(row);


      });
    } else {
      console.error("Error: " + xhr.status);
    }
  };
  
  xhr.send();



// // Consultar y mostrar Ventas
// const apiUrl = "https://localhost:7084/api/Ventas/ByFecha";

// function formatearFechaParaAPI(fecha) {
//   const partes = fecha.split('-');
//     if (partes.length === 3) {
//   const [dia, mes, anio] = partes;
//     return `${anio}-${mes}-${dia}`;
// }
// return fecha; 
// }

// // Función para mostrar ventas dentro del rango de fechas
// function mostrarVentas() {
//  const fechaInicial = document.querySelector('#fecha-inicial').value;
//  const fechaFinal = document.querySelector('#fecha-final').value;

//  // Validar pa q no estes vacias
//  if (!fechaInicial || !fechaFinal) {
//      alert("Debes seleccionar ambas fechas antes de mostrar las ventas.");
//      return;
//  }

//  // Aqui es donde se realiza una solicitud a la API con las fechas seleccionadas
//  fetch(`${apiUrl}?fechaInicio=${fechaInicial}&fechaFin=${fechaFinal}`)
//      .then((response) => response.json())
//      .then((data) => {
//          actualizarTablaVentas(data);
//      })
//      .catch((error) => {
//          console.error("Error al obtener datos de ventas:", error);
//      });
// }
// // Función para actualizar la tabla de ventas.
// function actualizarTablaVentas(venta) {
//     const tablaVentas = document.querySelector('#tabla-ventas tbody');
//     tablaVentas.innerHTML = ''; // Elimina las filas existentes

//     // Itere uno a uno los datos de ventas y agrega filas a la tabla
//     venta.forEach((ventas) => {
//         const fila = `
//             <tr>
//                 <td>${ventas.IdVenta}</td>
//                 <td>${ventas.FechaVenta}</td>
//                 <td>${ventas.TotalVenta}</td>
                
//             </tr>
//         `;
//         tablaVentas.innerHTML += fila;
//     });
// }

