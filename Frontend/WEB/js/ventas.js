$(document).ready(function () {
  const fecha = new Date();

    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Sumamos 1 porque los meses en JavaScript son de 0 a 11
    const dia = String(fecha.getDate()).padStart(2, '0');

    const fechaFinal = `${año}-${mes}-${dia}`;
    mostrarVentas("1999-02-23", fechaFinal);
});


// Consultar y mostrar Ventas
const apiUrl = hostDomain+"/edge-service/v1/service/venta/consultar/ByFecha";

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
function mostrarVentas(Finicial = "", Ffinal="") {
  var fechaInicial = "";
  var fechaFinal = "";

  // Obtener fechas desde los elementos de input
  if (Ffinal === "" && Finicial === "") {
    fechaInicial = document.querySelector('#fecha-inicial').value;
    fechaFinal = document.querySelector('#fecha-final').value;
  } else {
    fechaFinal = Ffinal;
    fechaInicial = Finicial;
  }

  // Verificar si se han ingresado fechas
  const filtrarPorFechas = fechaInicial && fechaFinal;

  // Si se han ingresado fechas, ajustar las horas
  if (filtrarPorFechas) {
    fechaInicial += ' 00:00:00'; // Agregar hora 00:00:00
    fechaFinal += ' 23:59:59';   // Agregar hora 23:59:59
  }

  // Construir la URL de la solicitud a la API con las fechas seleccionadas o sin filtrar
  let apiUrlConFechas = apiUrl;

  if (filtrarPorFechas) {
      apiUrlConFechas += `?fechaInicio=${fechaInicial}&fechaFin=${fechaFinal}`;
  }

  handleAjaxRequest(function (token) {
    callApiVentas(token, apiUrlConFechas);
  });
}


  function callApiVentas(token, apiUrlConFechas){
    var myHeaders = new Headers();
  myHeaders.append('Authorization', `Bearer ${token}`);

  var requestOptions = {
      method: 'GET',
      headers: myHeaders
  };

  fetch(apiUrlConFechas,requestOptions)
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
    // Formatea el campo totalVenta con el símbolo de pesos y la separación por puntos
    const totalVentaFormateado = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(venta.totalVenta);

    const fila = `<tr>
      <td>${venta.idVenta}</td>
      <td>${venta.fechaVenta}</td>
      <td>${totalVentaFormateado}</td>
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


function verDetalles(idVenta){
  handleAjaxRequest(function (token) {
    callApiVerDetalles(idVenta,token);
});
}


async function callApiVerDetalles(idVenta, token) {
  try {
    var myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };
    const response = await fetch(`${hostDomain}/edge-service/v1/service/venta/detalle/consultar/ByVenta/${idVenta}`, requestOptions);

    if (!response.ok) {
      throw new Error(`Error de red: ${response.status}`);
    }

    const detallesVenta = await response.json();

    // Llamamos a la función para mostrar detalles en una modal
    mostrarDetallesEnModal(idVenta, detallesVenta);

  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: error.message,
      icon:"warning",
      showCancelButton: false,
      confirmButtonColor: ' #d5c429 ',
      confirmButtonText: 'Confirmar',
  }).then((result) => {
     
  });
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
      // Formatear valores numéricos
      const cantidadFormateada = new Intl.NumberFormat('es-Co').format(detalle.cantidadProducto);
      const subTotalFormateado = new Intl.NumberFormat('es-Co', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(detalle.subTotalAPagar);

      tableHtml += `<tr><td>${index + 1}</td><td>${detalle.nombreProducto}</td><td>${cantidadFormateada}</td><td>${subTotalFormateado}</td></tr>`;
      totalVenta += detalle.subTotalAPagar;
  });

  // Formatear el total de la venta
  const totalVentaFormateado = new Intl.NumberFormat('es-Co', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(totalVenta);

  tableHtml += `<tr><td colspan="3" style="text-align: right;">Total Venta:</td><td>${totalVentaFormateado}</td></tr>`;
  tableHtml += '</tbody></table>';

  modalBody.innerHTML = `<p>ID Venta: ${idVenta}</p>${tableHtml}`;

  // Mostramos la modal
  $('#detallesModal').modal('show');
}



// Función para mostrar todas las ventas sin filtrar por fechas
function mostrarTodasLasVentas(token) {
  // Realiza una solicitud a la API para obtener todas las ventas
  var myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };
  fetch(apiUrl,requestOptions)
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
handleAjaxRequest(mostrarTodasLasVentas);