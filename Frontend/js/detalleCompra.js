const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

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
    // Identify the <select> element by its ID
    const selectElement = document.getElementById("idExistencia");

    // Make an HTTP request to the API (replace 'apiEndpoint' with your API URL)
    fetch("http://localhost:5175/Compras/listProducts")
    .then((response) => response.json())
    .then((data) => {
        // Iterate over the data and create <option> elements
        data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.idExistencia; // Set the value attribute based on your data
        option.textContent = item.nombreProducto; // Set the option text based on your data
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
    const idExistencia = document.getElementById("idExistencia");
    const idCompra = urlParams.get('idCompra');
    if (idCompra != null) {
        $.ajax({
        type: "POST",
        url: "http://localhost:5175/Compras/addOrEditDetail",
    
        data:JSON.stringify( {   
        idCompra: idCompra,
        idExistencias: idExistencia.value,
        cantidadProductos: cantidadInput.value,
        precio: precio.value,
        accion: "add"
        } ),
        contentType: "application/json",
        success: function(response) {
            // Procesar la respuesta exitosa
            console.log(response);
            const destinationURL = `http://127.0.0.1:5500/Frontend/comprasDetail.html?idCompra=${idCompra}`;
            window.location.href = destinationURL;
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