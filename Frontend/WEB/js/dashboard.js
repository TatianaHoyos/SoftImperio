// Función para obtener las ventas del ultimo mes
async function obtenerVentasUltimoMes(token) {
    try {
        var apiUrl = 'http://localhost:8081/edge-service/v1/service/venta/ultimo-mes/consultar';

        var myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        const respuesta = await fetch(apiUrl, requestOptions);

        if (!respuesta.ok) {
            throw new Error('Error al obtener las ventas del último mes. Estado de la respuesta: ' + respuesta.status);
        }

        const datos = await respuesta.json();
        //console.log('Datos de la API (Ventas Último Mes):', datos);

        if (Array.isArray(datos) && datos.length > 0 && datos[0].totalVenta !== undefined) {
            // Formatear el número con el símbolo de pesos y sin mostrar centavos
            const totalVentaFormateado = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(datos[0].totalVenta);

            // Actualiza el contenido del dashboard con los datos formateados
            document.getElementById('ventasTotales').innerHTML = totalVentaFormateado;
        } else {
            const totalVentaFormateado = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(0);
            document.getElementById('ventasTotales').innerHTML = totalVentaFormateado;
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






async function obtenerComprasUltimoMes(token) {
    try {
        var apiUrl = 'http://localhost:8081/edge-service/v1/service/compras/ultimo-mes/consultar';

        var myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };
        const respuesta = await fetch(apiUrl, requestOptions);
        if (!respuesta.ok) {
            throw new Error('Error al obtener las compras del último mes. Estado de la respuesta: ' + respuesta.status);
        }

        const datos = await respuesta.json();
        //console.log('Datos de la API (Compras Último Mes):', datos);

        if (datos.length > 0) {
            const totalCompraFormateado = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(datos[0].totalCompra);

            document.getElementById('comprasTotales').innerHTML = totalCompraFormateado;
        } else {
            const totalCompraFormateado = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(0);

            document.getElementById('comprasTotales').innerHTML = totalCompraFormateado;
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

async function obtenerCreditosUltimoMes(token) {
    try {
        var apiUrl = 'http://localhost:8081/edge-service/v1/service/creditos/ultimo-mes/consultar';

        var myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };
        const respuesta = await fetch(apiUrl, requestOptions);
       
        if (!respuesta.ok) {
            throw new Error('Error al obtener los créditos del último mes. Estado de la respuesta: ' + respuesta.status);
        }

        const datos = await respuesta.json();
        //console.log('Datos de la API (Créditos Último Mes):', datos);

        if (datos.length > 0) {
            const totalCreditoFormateado = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(datos[0].totalCredito);

            document.getElementById('creditosTotales').innerHTML = totalCreditoFormateado;
        } else {
            const totalCreditoFormateado = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(0);

            document.getElementById('creditosTotales').innerHTML = totalCreditoFormateado;
            console.warn('La respuesta de la API no contiene los datos esperados para los créditos del último mes.');
        }
    } catch (error) {
        console.error(error);
    }
}


// Función para realizar solicitudes HTTP usando fetch
async function fetchData(url, token) {
    var myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };
    const response = await fetch(url, requestOptions);
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


async function obtenerDatosGraficoVentas(token) {
    try {
        var apiUrl = 'http://localhost:8081/edge-service/v1/service/venta/por-mes/consultar';

        const datos = await fetchData(apiUrl, token);
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

async function obtenerDatosGraficoCompras(token) {
    try {
        const datos = await fetchData('http://localhost:8081/edge-service/v1/service/compras/por-mes/consultar', token);
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

function obtenerEtiquetas(datos) {
    const etiquetas = datos.map(item => {
        const fecha = new Date(item.año, item.mes - 1); 
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

        acumulador[etiqueta] += item.totalVenta || item.totalCompra || 0;
        return acumulador;
    }, {});

    return datosPorMes;
}

// Función para mostrar el gráfico de Ventas y Compras combinadas
async function mostrarGraficoVentasYCompras(token) {
    try {
        const datosGraficoVentas = await obtenerDatosGraficoVentas(token);
        const datosGraficoCompras = await obtenerDatosGraficoCompras(token);

        if (datosGraficoVentas && datosGraficoVentas.length > 0 && datosGraficoCompras && datosGraficoCompras.length > 0) {
            const datosPorMesVentas = obtenerDatosCompletos(datosGraficoVentas);
            const datosPorMesCompras = obtenerDatosCompletos(datosGraficoCompras);

            // Extrae las etiquetas (meses) y los datos (montos) desde los objetos agrupados
            let etiquetas = Object.keys({ ...datosPorMesVentas, ...datosPorMesCompras });
            etiquetas = etiquetas.sort((a, b) => a.localeCompare(b)); // Ordena las etiquetas

            const montosVentas = etiquetas.map(etiqueta => datosPorMesVentas[etiqueta] || 0);
            const montosCompras = etiquetas.map(etiqueta => datosPorMesCompras[etiqueta] || 0);

            // Configurar los datos según el formato necesario para Chart.js
            const data = {
                labels: etiquetas,
                datasets: [{
                    label: 'Total de Ventas',
                    data: montosVentas,
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                }, {
                    label: 'Total de Compras',
                    data: montosCompras,
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                }]
            };

            // Configurar las opciones del gráfico
            const options = {
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
                            text: 'Total de Ventas y Compras'
                        }
                    }
                }
            };

            // Obtener el contexto del canvas y renderizar el gráfico
            const ctx = document.getElementById('myChartVentasYCompras');
            const myChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: options
            });
        } else {
            console.warn('No se encontraron datos válidos para mostrar el gráfico de Ventas y Compras.');
        }
    } catch (error) {
        console.error('Error al mostrar el gráfico de Ventas y Compras:', error);
    }
}


// Función para obtener datos de la API de Productos
async function obtenerDatosGraficoProductos(token) {
    try {
        var myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };
        const respuesta = await fetch('http://localhost:8081/edge-service/v1/service/productos/con/existencias', requestOptions);
        if (!respuesta.ok) {
            throw new Error('Error al obtener los datos de productos. Estado de la respuesta: ' + respuesta.status);
        }

        const datos = await respuesta.json();
        // console.log('Datos de la API (Productos):', datos);

        if (datos && datos.length > 0) {
            // Extrae los nombres de productos, referencias y cantidades
            const nombresProductos = datos.map(item => item.nombreProducto);
            const referenciasProductos = datos.map(item => item.referenciaProducto);
            const cantidadesProductos = datos.map(item => item.cantidad);

            // Combina nombre y referencia para formar la etiqueta del producto
            const etiquetasProductos = nombresProductos.map((nombre, index) => `${nombre} - ${referenciasProductos[index]}`);

            // Configurar los datos según el formato necesario para Chart.js
            const dataProductos = {
                labels: etiquetasProductos,
                datasets: [{
                    label: 'Cantidad de Productos',
                    data: cantidadesProductos,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            };

            // Configurar las opciones del gráfico
            const optionsProductos = {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Productos'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Cantidad'
                        }
                    }
                }
            };

            // Obtener el contexto del canvas y renderizar el gráfico
            const ctxProductos = document.getElementById('myChartProductos');
            const myChartProductos = new Chart(ctxProductos, {
                type: 'bar',
                data: dataProductos,
                options: optionsProductos
            });
        }
    } catch (error) {
        console.error('Error al obtener datos del gráfico de Productos:', error);
    }
}





window.onload = function () {
    handleAjaxRequest(obtenerVentasUltimoMes);
    
    handleAjaxRequest(obtenerComprasUltimoMes);
    handleAjaxRequest(obtenerCreditosUltimoMes);
    handleAjaxRequest(mostrarGraficoVentasYCompras);
    handleAjaxRequest(obtenerDatosGraficoProductos);
};
