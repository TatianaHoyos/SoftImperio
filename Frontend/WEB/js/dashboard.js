// Función para obtener las ventas del ultimo mes
async function obtenerVentasUltimoMes() {
    try {
        const respuesta = await fetch('https://localhost:7084/api/Ventas/ventas-ultimo-mes');
        if (!respuesta.ok) {
            throw new Error('Error al obtener las ventas del último mes. Estado de la respuesta: ' + respuesta.status);
        }

        const datos = await respuesta.json();
        //console.log('Datos de la API (Ventas Último Mes):', datos);

        if (Array.isArray(datos) && datos.length > 0 && datos[0].totalVenta !== undefined) {
            // Formatear el número con el símbolo de pesos
            const totalVentaFormateado = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(datos[0].totalVenta);

            // Actualiza el contenido del dashboard con los datos formateados
            document.getElementById('ventasTotales').innerHTML = totalVentaFormateado;
        } else {
            console.warn('La respuesta de la API no contiene los datos esperados para las ventas del último mes.');
        }
    } catch (error) {
        //console.error(error);
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





async function obtenerComprasUltimoMes() {
    try {
        const respuesta = await fetch('https://localhost:7084/api/Compra/compras-ultimo-mes');
        if (!respuesta.ok) {
            throw new Error('Error al obtener las compras del último mes. Estado de la respuesta: ' + respuesta.status);
        }

        const datos = await respuesta.json();
        //console.log('Datos de la API (Compras Último Mes):', datos);

        if (datos.length > 0) {
            const totalCompraFormateado = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(datos[0].totalCompra);

            document.getElementById('comprasTotales').innerHTML = totalCompraFormateado;
        } else {
            console.warn('La respuesta de la API no contiene los datos esperados para las compras del último mes.');
        }
    } catch (error) {
        //console.error(error);
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

async function obtenerCreditosUltimoMes() {
    try {
        const respuesta = await fetch('https://localhost:7084/api/Creditos/creditos-ultimo-mes');
        if (!respuesta.ok) {
            throw new Error('Error al obtener los créditos del último mes. Estado de la respuesta: ' + respuesta.status);
        }

        const datos = await respuesta.json();
        //console.log('Datos de la API (Créditos Último Mes):', datos);

        if (datos.length > 0) {
            const totalCreditoFormateado = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(datos[0].totalCredito);

            document.getElementById('creditosTotales').innerHTML = totalCreditoFormateado;
        } else {
            console.warn('La respuesta de la API no contiene los datos esperados para los créditos del último mes.');
        }
    } catch (error) {
        console.error(error);
    }
}


// Función para realizar solicitudes HTTP usando fetch
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error al obtener los datos. Estado de la respuesta: ${response.status}`);
    }
    return response.json();
}

function obtenerEtiquetas(datos) {
    const etiquetas = datos.map(item => {
        const fecha = new Date(item.año, item.mes - 1); // Restamos 1 al mes ya que en JavaScript los meses van de 0 a 11
        return moment(fecha).format('YYYY-MM');
    });
    return etiquetas;
}

function obtenerDatosCompletos(datos) {
    const datosPorMes = datos.reduce((acumulador, item) => {
        const fecha = new Date(item.año, item.mes - 1); 
        const etiqueta = moment(fecha).format('YYYY-MM');

        if (!acumulador[etiqueta]) {
            acumulador[etiqueta] = 0;
        }

        acumulador[etiqueta] += item.totalVenta || item.totalCompra || 0; // Consideramos el total de venta o compra o 0 si no existe
        return acumulador;
    }, {});

    return datosPorMes;
}


// Función para obtener datos de la API de Ventas
async function obtenerDatosGraficoVentas() {
    try {
        const datos = await fetchData('https://localhost:7084/api/Ventas/ventas-por-mes');
        //console.log('Datos completos de la API (Ventas):', datos);
        return datos;
    } catch (error) {
        //console.error('Error al obtener datos del gráfico de Ventas:', error);
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon:"warning",
            showCancelButton: false,
            confirmButtonColor: ' #d5c429 ',
            confirmButtonText: 'Confirmar',
        }).then((result) => {
           
        });
        return [];
    }
}

// Función para obtener datos de la API de Compras
async function obtenerDatosGraficoCompras() {
    try {
        const datos = await fetchData('https://localhost:7084/api/Compra/compras-por-mes');
        //console.log('Datos completos de la API (Compras):', datos);
        return datos;
    } catch (error) {
       //console.error('Error al obtener datos del gráfico de Compras:', error);
        Swal.fire({
            title: 'Error',
            text: error.message,
            icon:"warning",
            showCancelButton: false,
            confirmButtonColor: ' #d5c429 ',
            confirmButtonText: 'Confirmar',
        }).then((result) => {
           
        });
        return [];
    }
}

// Función para mostrar el gráfico de Ventas
async function mostrarGrafico() {
    try {
        const datosGraficoVentas = await obtenerDatosGraficoVentas();

        if (datosGraficoVentas && datosGraficoVentas.length > 0) {
            // Agrupa los datos por mes y suma los montos de venta
            const datosPorMesVentas = obtenerDatosCompletos(datosGraficoVentas);

            // Extrae las etiquetas (meses) y los datos (montos) desde el objeto agrupado
            const etiquetasVentas = obtenerEtiquetas(datosGraficoVentas);
            const montosVentas = Object.values(datosPorMesVentas);

            // Configurar los datos según el formato necesario para Chart.js
            const dataVentas = {
                labels: etiquetasVentas,
                datasets: [{
                    label: 'Total de Ventas',
                    data: montosVentas,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            };

            // Configurar las opciones del gráfico
            const optionsVentas = {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Mes'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Total de Ventas'
                        }
                    }
                }
            };

            // Obtener el contexto del canvas y renderizar el gráfico
            const ctxVentas = document.getElementById('myChartVentas');
            const myChartVentas = new Chart(ctxVentas, {
                type: 'bar',
                data: dataVentas,
                options: optionsVentas
            });
        } else {
            console.warn('No se encontraron datos válidos para mostrar el gráfico de Ventas.');
        }
    } catch (error) {
        console.error('Error al mostrar el gráfico de Ventas:', error);
    }
}

// Función para mostrar el gráfico de Compras
async function mostrarGraficoCompras() {
    try {
        const datosGraficoCompras = await obtenerDatosGraficoCompras();

        if (datosGraficoCompras && datosGraficoCompras.length > 0) {
            const datosPorMesCompras = obtenerDatosCompletos(datosGraficoCompras);
            const etiquetasCompras = obtenerEtiquetas(datosGraficoCompras);
            const montosCompras = Object.values(datosPorMesCompras);

            // Configurar los datos según el formato necesario para Chart.js
            const dataCompras = {
                labels: etiquetasCompras,
                datasets: [{
                    label: 'Total de Compras',
                    data: montosCompras,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            };

            // Configurar las opciones del gráfico
            const optionsCompras = {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Mes'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Total de Compras'
                        }
                    }
                }
            };

            // Obtener el contexto del canvas y renderizar el gráfico
            const ctxCompras = document.getElementById('myChartCompras');
            const myChartCompras = new Chart(ctxCompras, {
                type: 'bar',
                data: dataCompras,
                options: optionsCompras
            });
        } else {
            console.warn('No se encontraron datos válidos para mostrar el gráfico de Compras.');
        }
    } catch (error) {
        console.error('Error al mostrar el gráfico de Compras:', error);
    }
}

// Llamamos a las funciones para mostrar ambos gráficos al cargar la página
window.onload = function () {
    obtenerVentasUltimoMes();
    obtenerComprasUltimoMes();
    obtenerCreditosUltimoMes();
    mostrarGrafico();
    mostrarGraficoCompras();
};
