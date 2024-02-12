 
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
                <button class="btn btn-info" onclick="verDetalles(${ventas.idVenta})">Detalles</button>
                </td>
            </tr>
        `;
        tablaVentas.innerHTML += fila;
    });
}


function verDetalles(idVenta) {
    fetch(`https://localhost:7084/api/DetalleVentas/ByVenta/${idVenta}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error de red: ${response.status}`);
        }
        return response.json();
      })
      .then((detallesVenta) => {
        // Aquí deberías tener un array de detalles de venta correspondientes al IdVenta
        console.log('Detalles de la venta:', detallesVenta);
  
        // Puedes mostrar los detalles como desees, por ejemplo, en un cuadro de diálogo
        alert(`Detalles de la venta con ID: ${idVenta}\n${JSON.stringify(detallesVenta, null, 2)}`);
      })
      .catch((error) => {
        console.error("Error al obtener detalles de la venta:", error);
      });
  }
  








