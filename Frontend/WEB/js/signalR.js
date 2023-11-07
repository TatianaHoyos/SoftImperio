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
        await connection.on("ReceiveMessage", (user, message) => {
         alert(user,message);
       })
    } catch (error) {
        console.log(error);
    }
}

const startApp= async () => {
    // Start the connection.
    await  start();
    await receiveMessage();
}

startApp();
