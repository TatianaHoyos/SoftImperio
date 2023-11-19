const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let listData;

function asignarValor(data) {
    listData = data;
}

$(document).ready(function() {
    var miTabla = $('#miTabla').DataTable();
    const idCompra = urlParams.get('idCompra');
    const apiUrl = 'http://localhost:5175/Compras/listDetail';
    console.log("funciona esto "+idCompra);
    if (idCompra != null) {
        $.ajax({
        url: apiUrl,
        type: 'POST',
        data:JSON.stringify( {   
            id: idCompra
        } ),
        contentType: "application/json",
        success: function(data) {
            asignarValor(data);
            console.log("detailData "+data);
            // Itera a través de los datos y agréga a la tabla
            $.each(data, function(index, item) {
            var editButton = '<button class="btn btn-warning d-inline"><i class="fas fa-edit" onclick="editDetail(' + item.idDetalleCompra+ ')"></i> </button>';
            var deleteButton = '<button class="btn btn-danger d-inline"><i class="fas fa-trash-alt" onclick="deleteDetail(' + item.idDetalleCompra+ ')"></i> </button>';
            
            miTabla.row.add([
                item.categoria,
                item.nombreProducto + ' - ' + item.referenciaProducto,
                item.cantidadProductos,
                item.precioProducto,
                item.subTotal,
                editButton + ' ' + deleteButton // Columna de acciones con botones de editar y eliminar
            ]).draw();
            });
        },
        error: function(error) {
            console.error('Error al obtener los datos de la API:', error);
        }
        });
    }else{
        const destinationURL = `http://127.0.0.1:5500/Frontend/compras.html`;
        window.location.href = destinationURL;
    }    
  });

  
  function deleteDetail(id) {
    Swal.fire({
      title: 'Confirma Eliminación',
      text: 'Estas seguro de eliminar este detalle de la compra?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked "Yes," proceed with the API call
        var idCompra = urlParams.get('idCompra');
        $.ajax({
          type: 'POST',
          url: 'http://localhost:5175/Compras/deleteDetail',
          data: JSON.stringify({ id: id,
        idCompra }),
          contentType: 'application/json',
          success: function (response) {
            console.log(response);
            window.location.reload();
          },
          error: function (error) {
            // Handle the error
            console.log(error);
          }
        });
      } else {
      }
    });
  }
  
  function editDetail(id) {
    if (listData !== undefined) {
        let accion = "edit";
        console.log("El valor de la variable es: " + listData);
        listData.forEach(function(item) {
          if( parseInt(item.idDetalleCompra) == id){
            var selectElement = document.getElementById("idExistencia");
            var nuevaOpcion = document.createElement("option");
            nuevaOpcion.value = item.idExistencia;
            nuevaOpcion.text = item.nombreProducto;     // Aquí define el texto que deseas mostrar
            nuevaOpcion.id = "opcionEdit";
            nuevaOpcion.selectedIndex =true; 
            selectElement.add(nuevaOpcion);

            $('#Cantidad').val(item.cantidadProductos);
            $('#Precio').val(item.precioProducto);
            $('#accion').val(accion);
            $('#idDetalleCompra').val(item.idDetalleCompra);
            console.log("error ",$('#idExistencia').val());
          }
          });
      } else {
        console.log("La variable aún no tiene un valor asignado.");
      }
  }

  function limpiarFormulario(){
    var empty = "";
    var selectElement = document.getElementById("idExistencia");
    var opcionAEliminar = document.getElementById("opcionEdit");
    if (selectElement && opcionAEliminar) {
        selectElement.removeChild(opcionAEliminar);
    } 
    $('#Cantidad').val(empty);
    $('#Precio').val(empty);
    $('#accion').val("add");
    $('#idDetalleCompra').val(empty);
  }
function nuevoDetalleCompra(){

    const idCompra = urlParams.get('idCompra');
    console.log("nuevo detalle "+urlParams.get('idCompra'));
    if (idCompra != null) {
        const destinationURL = `http://127.0.0.1:5500/Frontend/nuevaCompra.html?idCompra=${idCompra}`;
        window.location.href = destinationURL;
    }else{
      const destinationURL = `http://127.0.0.1:5500/Frontend/compras.html`;
      window.location.href = destinationURL;
    }

}

function listExistenciaProductos(){
    const selectElement = document.getElementById("idExistencia");

    fetch("http://localhost:5175/Compras/listProducts")
    .then((response) => response.json())
    .then((data) => {
        // Iterate over the data and create <option> elements
        data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.idExistencia; 
        option.textContent = item.nombreProducto; 
        selectElement.appendChild(option); // Append the option to the <select>
        });
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    });

}

function crearDetalleCliente(){
    const cantidadInput = document.getElementById("Cantidad");
    const precio = document.getElementById("Precio");
    const accion = document.getElementById("accion");
    const idExistencia = accion=="edit"? document.getElementById("opcionEdit"): document.getElementById("idExistencia");
    const idCompra = urlParams.get('idCompra');
    const idDetalleCompra = document.getElementById("idDetalleCompra");
    var request= JSON.stringify( {   
        idCompra: idCompra,
        idExistencias: idExistencia.value,
        cantidadProductos: cantidadInput.value,
        precio: precio.value,
        accion: accion.value,
        idDetalleCompra: idDetalleCompra.value==""?"0":idDetalleCompra.value
        } );
        console.log(request);
    if (idCompra != null) {
        $.ajax({
        type: "POST",
        url: "http://localhost:5175/Compras/addOrEditDetail",
        data: request,
        contentType: "application/json",
        success: function(response) {
            // Procesar la respuesta exitosa
            console.log(response);
            limpiarFormulario();
            window.location.reload();
        },
        error: function(error) {
            // Manejar el error
            console.log(error);
        }
        });
    }else{
        const destinationURL = `http://127.0.0.1:5500/Frontend/compras.html`;
        window.location.href = destinationURL;
    }    
}
