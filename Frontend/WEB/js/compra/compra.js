console.log("cargando scripts");
listCompras();

function addCompra() {
    console.log(new Date().getTime() + ' fecha' );
    $.ajax({
      type: "POST",
      url: "https://localhost:7084/Compras/add",
  
      data:JSON.stringify( { fechaCompra: new Date(), totalCompra: 0} ),
      contentType: "application/json",
      success: function(response) {
        // Procesar la respuesta exitosa
        console.log(response);
        habilitarVistaDetalle(response.idCompra);
        //window.location.reload();
      },
      error: function(error) {
        // Manejar el error
        console.log(error);
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
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked "Yes," proceed with the API call
        $.ajax({
          type: 'POST',
          url: 'https://localhost:7084/Compras/delete',
          data: JSON.stringify({ id: idCompra }),
          contentType: 'application/json',
          success: function (response) {
            // Process the successful response
            console.log(response);
            window.location.reload();
          },
          error: function (error) {
            // Handle the error
            console.log(error);
          }
        });
      } else {
        // User clicked "Cancel" or closed the dialog, do nothing
      }
    });
  }
  
  function habilitarVistaDetalle(idCompra){
    const destinationURL = `http://127.0.0.1:5500/Frontend/WEB/comprasDetail.html?idCompra=${idCompra}`;
    window.location.href = destinationURL;
  }

    function listCompras() {
        const apiUrl = 'https://localhost:7084/Compras/list';
        fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            return response.json(); 
        })
        .then((responseData) => {
            console.log(responseData);
            
            const tableBody = document.getElementById("tbody_compras");
  
            // Iterate over each object in the response data array
            responseData.forEach(function (item) {
              const row = createTableRow(item);
              tableBody.appendChild(row);
            });
            
        })
        .catch((error) => {
            // Handle errors here
            console.error('There was a problem with the fetch operation:', error);
        });
    }


    // Function to create a table row with the given data
function createTableRow(data) {
    const row = document.createElement("tr");
  
    // Iterate over each property in the data object
    const propertyOrder = [ "idCompra",  "fechaCompra",  "totalCompra"];

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
        habilitarVistaDetalle(data["idCompra"]);
      };
    editCell.appendChild(editButton);
    row.appendChild(editCell);
  
    // Add the delete button cell
    const deleteCell = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn btn-warning d-inline";
    deleteButton.onclick =  function() {
        deleteCompra(data["idCompra"]);
    };
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fa fa-trash";
    deleteIcon.setAttribute("aria-hidden", "true");
    deleteButton.appendChild(deleteIcon);
    deleteCell.appendChild(deleteButton);
    row.appendChild(deleteCell);
  
    return row;
  }