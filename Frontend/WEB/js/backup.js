function downloadBackup() {
    // var url = 'https://localhost:7084/api/Backup/backup/sql'; 

    // aqui se realiza la solicitud GET al servidor para descargar el archivo SQL
    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al descargar el archivo');
        }
        return response.blob(); // Convertir la respuesta a un blob
    })
    .then(blob => {
        // Crear un objeto URL para el blob
        var url = window.URL.createObjectURL(blob);

        // Crear un enlace <a> para descargar el archivo
        var a = document.createElement('a');
        a.href = url;
        a.download = 'Copia_de_seguridad.sql'; // Nombre del archivo de respaldo
        document.body.appendChild(a);
        
        // Hacer clic en el enlace para iniciar la descarga
        a.click();

        // Liberar el objeto URL
        window.URL.revokeObjectURL(url);
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al descargar el archivo de respaldo');
    });
}

// Llamar a la función para descargar el archivo cuando se haga clic en el botón
document.getElementById('backupButton').addEventListener('click', function() {
    downloadBackup();
});
