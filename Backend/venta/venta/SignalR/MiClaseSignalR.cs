using Microsoft.AspNetCore.SignalR;

namespace venta.SignalR
{
    public class MiClaseSignalR:Hub
    {
        public async Task  EnviarMensaje(string message,string user)
        {
            await Clients.All.SendAsync("respuesta del signalR ", user, message);
        }
    }
}
