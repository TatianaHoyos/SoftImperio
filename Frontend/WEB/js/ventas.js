 
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


let data;
let paginaActual = 1;
const ventasPorPagina = 6; // Puedes ajustar el número de ventas por página

// Función para mostrar ventas dentro del rango de fechas
function mostrarVentas() {
  const fechaInicial = document.querySelector('#fecha-inicial').value;
  const fechaFinal = document.querySelector('#fecha-final').value;

  // Verificar si se han ingresado fechas
  const filtrarPorFechas = fechaInicial && fechaFinal;

  // Aqui es donde se realiza una solicitud a la API con las fechas seleccionadas o sin filtrar
  let apiUrlConFechas = apiUrl;

  if (filtrarPorFechas) {
      apiUrlConFechas += `?fechaInicio=${fechaInicial}&fechaFin=${fechaFinal}`;
  }

  fetch(apiUrlConFechas)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Error de red: ${response.status}`);
        }
        return response.json();
    })
    .then((datos) => {
        data = datos;
        actualizarTablaVentas(data, paginaActual);
    })
    .catch((error) => {
        console.error("Error al obtener datos de ventas:", error);
    });
  }

// Función para actualizar la tabla de ventas con paginación
function actualizarTablaVentas(ventas, pagina) {
  const tablaVentas = document.querySelector('#tabla-ventas tbody');
  tablaVentas.innerHTML = ''; // Elimina las filas existentes

  const inicio = (pagina - 1) * ventasPorPagina;
  const fin = inicio + ventasPorPagina;

  // Iteramos solo las ventas de la página actual
  ventas.slice(inicio, fin).forEach((venta) => {
    const fila = `<tr>
      <td>${venta.idVenta}</td>
      <td>${venta.fechaVenta}</td>
      <td>${venta.totalVenta}</td>
      <td>
        <button class="btn btn-detalles" onclick="verDetalles(${venta.idVenta})">Detalles</button>
      </td>
    </tr>`;
    tablaVentas.innerHTML += fila;
  });

  // Actualizamos el número de página actual
  document.getElementById('paginaActual').innerText = `Página ${pagina}`;
}

// Eventos para botones de paginación
document.getElementById('btnPaginaAnterior').addEventListener('click', () => {
  if (paginaActual > 1) {
    paginaActual--;
    mostrarVentas();
  }
});

document.getElementById('btnPaginaSiguiente').addEventListener('click', () => {
  // Puedes ajustar esto según la cantidad total de páginas
  const totalPaginas = Math.ceil(data.length / ventasPorPagina);

  if (paginaActual < totalPaginas) {
    paginaActual++;
    mostrarVentas();
  }
});




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
  let tableHtml = '<table class="table table-bordered detalle-venta-table"><thead><tr><th>#</th><th>Producto</th><th>Cantidad</th><th>Subtotal</th></tr></thead><tbody>';

  let totalVenta = 0;

  detallesVenta.forEach((detalle, index) => {
    tableHtml += `<tr><td>${index + 1}</td><td>${detalle.nombreProducto}</td><td>${detalle.cantidadProducto}</td><td>${detalle.subTotalAPagar}</td></tr>`;
    totalVenta += detalle.subTotalAPagar;
  });

  tableHtml += `<tr><td colspan="3" style="text-align: right;">Total Venta:</td><td>${totalVenta}</td></tr>`;
  tableHtml += '</tbody></table>';

  modalBody.innerHTML = `<p>ID Venta: ${idVenta}</p>${tableHtml}`;

  // Mostramos la modal
  $('#detallesModal').modal('show');
}



// Función para mostrar todas las ventas sin filtrar por fechas
function mostrarTodasLasVentas() {
  // Realiza una solicitud a la API para obtener todas las ventas
  fetch(apiUrl)
      .then((response) => {
          if (!response.ok) {
              throw new Error(`Error de red: ${response.status}`);
          }
          return response.json();
      })
      .then((datos) => {
          data = datos;
          actualizarTablaVentas(data, paginaActual);
      })
      .catch((error) => {
          console.error("Error al obtener datos de ventas:", error);
      });
}

// Llama a la función para mostrar todas las ventas al cargar la página
mostrarTodasLasVentas();








