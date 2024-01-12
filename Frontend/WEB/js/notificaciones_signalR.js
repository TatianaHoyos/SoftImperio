const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7084/NotificarPedido")
    .configureLogging(signalR.LogLevel.Information)
    .build();

async function start() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};

connection.onclose(async () => {
    await start();
});

// method for getting notified by server
const receiveMessage = async () => {
    try {
        await connection.on("ReceiveMessage", (message, user) => {
            console.log(message);
            //alert(user,message);

            // Convertir el string JSON a un objeto
            var notificacionPedidos = JSON.parse(message);
            onExitoVentasPendientes(notificacionPedidos);


        });
    } catch (error) {
        console.log(error);
    }
}

const startApp = async () => {
    // Start the connection.
    consultarApiVentasPendientes();
    await start();
    await receiveMessage();
}

startApp();

function consultarApiVentasPendientes(){
    $.ajax({
        type: "GET",
        url: "https://localhost:7084/api/Ventas/Pendientes",
        "headers": {
            "Content-Type": "application/json"
        },
        success: function (data) {
            onExitoVentasPendientes(data);
        },
        error: onErrorVentasPendientes
        
    });
}

function onExitoVentasPendientes(data){
    $("#contadorNotificaciones").text(data.length);

            // Obtén el contenedor de notificaciones
            var contenedorNotificaciones = document.getElementById('contenedorNotificaciones');
            contenedorNotificaciones.innerHTML = '';
            // Recorre el array de pedidos
            data.forEach(function (pedido) {
                // Crea un elemento de lista
                var listItem = document.createElement('li');

                // Crea un enlace
                var enlace = document.createElement('a');
                enlace.href = '#';
                enlace.className = 'top-text-block';

                // Crea el contenido del enlace con la información del pedido
                var contenidoEnlace = document.createElement('div');
                contenidoEnlace.className = 'top-text-heading';
                contenidoEnlace.innerHTML = 'Pedido: <b>' + pedido.idVenta + '</b> - Total: <b>$' + pedido.totalVenta + '</b>';
               
                var resultado = tiempoTranscurrido(pedido.fechaVenta);
                // Crea el span con la información de la hora
                var spanHora = document.createElement('span');
                spanHora.className = 'top-text-light';
                spanHora.innerHTML = resultado;

                // Añade el contenido al enlace
                enlace.appendChild(contenidoEnlace);
                enlace.appendChild(spanHora);

                // Añade el enlace al elemento de lista
                listItem.appendChild(enlace);

                // Añade el elemento de lista al contenedor de notificaciones
                contenedorNotificaciones.appendChild(listItem);
            });

}

function onErrorVentasPendientes(error){
    console.log(error.responseJSON)   

}


function tiempoTranscurrido(fechaVenta) {
    // Obtener la fecha actual
    var fechaActual = new Date();

    // Obtener la fecha de venta como un objeto Date
    var fechaVenta = new Date(fechaVenta);

    // Calcular la diferencia en milisegundos
    var tiempoTranscurrido = fechaActual - fechaVenta;

    // Convertir la diferencia a minutos
    var minutos = Math.floor(tiempoTranscurrido / (1000 * 60));

    // Generar el formato según los minutos
    if (minutos < 1) {
        return 'justo ahora';
    } else if (minutos === 1) {
        return 'hace 1 minuto';
    } else if (minutos < 60) {
        return `hace ${minutos} minutos`;
    } else if (minutos < 120) {
        return 'hace 1 hora';
    } else if (minutos < 1440) {
        return `hace ${Math.floor(minutos / 60)} horas`;
    } else {
        return 'hace más de un día';
    }
}
