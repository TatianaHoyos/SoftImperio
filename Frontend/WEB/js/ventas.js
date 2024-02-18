 
// Consultar y mostrar Ventas
const apiUrl = "https://localhost:7084/api/Ventas/ByFecha";

function formatearFechaParaAPI(fecha) {
  const partes = fecha.split('-');
    if (partes.length === 3) {
  const [dia, mes, anio] = partes;
    return `${anio}-${mes}-${dia}`;
}
return fecha; 
}

// Función para mostrar ventas dentro del rango de fechas
function mostrarVentas() {
 const fechaInicial = document.querySelector('#fecha-inicial').value;
 const fechaFinal = document.querySelector('#fecha-final').value;

 // Validar pa q no estes vacias
 if (!fechaInicial || !fechaFinal) {
     alert("Debes seleccionar ambas fechas antes de mostrar las ventas.");
     return;
 }

 // Aqui es donde se realiza una solicitud a la API con las fechas seleccionadas
 fetch(`${apiUrl}?fechaInicio=${fechaInicial}&fechaFin=${fechaFinal}`)
     .then((response) => response.json())
     .then((data) => {
         actualizarTablaVentas(data);
     })
     .catch((error) => {
         console.error("Error al obtener datos de ventas:", error);
     });
}
// Función para actualizar la tabla de ventas.
function actualizarTablaVentas(venta) {
    const tablaVentas = document.querySelector('#tabla-ventas tbody');
    tablaVentas.innerHTML = ''; // Elimina las filas existentes

    // Itere uno a uno los datos de ventas y agrega filas a la tabla
    venta.forEach((ventas) => {
        const fila = `
            <tr>
                <td>${ventas.idVenta}</td>
                <td>${ventas.fechaVenta}</td>
                <td>${ventas.totalVenta}</td>
                <td>
                <button class="btn btn-detalles" onclick="verDetalles(${ventas.idVenta})">Detalles</button>
                </td>
            </tr>
        `;
        tablaVentas.innerHTML += fila;
    });
}




async function verDetalles(idVenta) {
  try {
    const response = await fetch(`https://localhost:7084/api/DetalleVentas/ByVenta/${idVenta}`);

    if (!response.ok) {
      throw new Error(`Error de red: ${response.status}`);
    }

    const detallesVenta = await response.json();

    console.log('Detalles de la venta:', detallesVenta);

    // Llamamos a la función para mostrar detalles en una modal
    mostrarDetallesEnModal(idVenta, detallesVenta);

  } catch (error) {
    console.error("Error al obtener detalles de la venta:", error);
  }
}

// Función para mostrar detalles en una modal con una tabla
function mostrarDetallesEnModal(idVenta, detallesVenta) {
  // Modificamos el contenido de la modal con una tabla de detalles
  const modalBody = document.getElementById('detallesModalBody');

  // Construimos la tabla con la clase de estilo
  let tableHtml = '<table class="table table-bordered detalle-venta-table"><thead><tr><th>Producto</th><th>Cantidad </th><th>Subtotal </th></tr></thead><tbody>';

  detallesVenta.forEach((detalle) => {
    tableHtml += `<tr><td>${detalle.nombreProducto}</td><td>${detalle.cantidadProducto}</td><td>${detalle.subTotalAPagar}</td></tr>`;
  });

  tableHtml += '</tbody></table>';

  modalBody.innerHTML = `<p>ID Venta: ${idVenta}</p>${tableHtml}`;

  // Mostramos la modal
  $('#detallesModal').modal('show');
}










