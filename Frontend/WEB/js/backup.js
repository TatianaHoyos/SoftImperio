function descargarCopiaSeguridad() {
    handleAjaxRequest(callApiDescargarCopiaSeguridad);
}

function callApiDescargarCopiaSeguridad(token) {
    $.ajax({
        type: "GET",
        url: hostDomain+"/edge-service/v1/backup/download",
        headers: {
            'Authorization': `Bearer ${token}`
           
        },
        xhrFields: {
            responseType: 'arraybuffer' // Indica que esperamos un array de bytes como respuesta
          },
        success: function(response, status, xhr) {
            if (xhr.status === 200) {
                const blob = new Blob([response], { type: 'application/octet-stream' });
                const blobURL = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobURL;
                link.download = 'CopiaSeguridad.sql';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setTimeout(() => {
                    URL.revokeObjectURL(blobURL);
                }, 5000);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: `Error en la respuesta del servidor. Código de estado: ${xhr.status}`,
                    icon: "warning",
                    showCancelButton: false,
                    confirmButtonColor: '#ae9243',
                    confirmButtonText: 'Confirmar',
                });
            }
        },
        error: function(error) {
            Swal.fire({
                title: 'Error',
                text: 'Error en la respuesta',
                icon: "warning",
                showCancelButton: false,
                confirmButtonColor: '#ae9243',
                confirmButtonText: 'Confirmar',
            });
        }
    });
}


























// function downloadBackup() {
//     var url = 'https://localhost:7084/api/Backup/backup/sql'; 

//     // aqui se realiza la solicitud GET al servidor para descargar el archivo SQL
//     fetch(url)
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Error al descargar el archivo');
//         }
//         return response.blob(); // Convertir la respuesta a un blob
//     })
//     .then(blob => {
//         // Crear un objeto URL para el blob
//         var url = window.URL.createObjectURL(blob);

//         // Crear un enlace <a> para descargar el archivo
//         var a = document.createElement('a');
//         a.href = url;
//         a.download = 'Copia_de_seguridad.sql'; // Nombre del archivo de respaldo
//         document.body.appendChild(a);
        
//         // Hacer clic en el enlace para iniciar la descarga
//         a.click();

//         // Liberar el objeto URL
//         window.URL.revokeObjectURL(url);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert('Error al descargar el archivo de respaldo');
//     });
// }

// // Llamar a la función para descargar el archivo cuando se haga clic en el botón
// document.getElementById('backupButton').addEventListener('click', function() {
//     downloadBackup();
// });
