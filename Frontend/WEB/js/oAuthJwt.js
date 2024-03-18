$(document).ready(function() {
    var objetoRecuperado = localStorage.getItem('miObjeto');
    if (objetoRecuperado == null) {
        if (!window.location.href.includes("iniciosesion.html")) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops',
            text: 'La sesión ha expirado. Por favor, vuelve a iniciar sesión.',
            showCancelButton: false,
            confirmButtonColor: ' #d5c429 ',
            confirmButtonText: 'Confirmar',
        }).then((result) => {
            window.location.href = "./iniciosesion.html";
        });
    }
    }
});

// Uso de la función para manejar una solicitud Ajax
function isTokenExpired(token) {
    if (!token) {
        // El token no está presente
        return true;
    }

    const decodedToken = parseJwt(token);

    if (!decodedToken || !decodedToken.exp) {
        // No se puede decodificar el token o no contiene la propiedad 'exp'
        return true;
    }

    // Obtener la fecha de expiración en segundos
    const expirationTime = decodedToken.exp * 1000;

    // Obtener la fecha actual en milisegundos
    const currentTime = new Date().getTime();

    // Comprobar si el token ha expirado
    return currentTime > expirationTime;
}

// Función para decodificar un token JWT
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        // Manejar errores al decodificar el token
        console.error('Error al decodificar el token:', error);
        return null;
    }
}
let isRefreshingToken = false;

function handleAjaxRequest(ajaxRequestFunction) {
    if (isRefreshingToken) {
        // Si ya hay una actualización de token en curso, espera y reintenta después de un tiempo
        setTimeout(() => handleAjaxRequest(ajaxRequestFunction), 500); // Espera 1 segundo y reintenta
        return;
    }

    isRefreshingToken = true;
    var objetoRecuperado = JSON.parse(localStorage.getItem('miObjeto'));
    if (isTokenExpired(objetoRecuperado.authoritation.accessToken)) {
        refreshAccessToken().then(newToken => {
            ajaxRequestFunction(newToken);
            isRefreshingToken = false;
        }).catch(error => {
            console.error('Error al intentar refrescar el token:', error);
            isRefreshingToken = false;
        });
    } else {
        ajaxRequestFunction(objetoRecuperado.authoritation.accessToken);
        isRefreshingToken = false;
    }
}

function refreshAccessToken() {
    var apiUrl = 'http://localhost:8081/edge-service/v1/authorization/refreshToken';
    var objetoRecuperado = JSON.parse(localStorage.getItem('miObjeto'));
    // Invocar la función Java para refrescar el token y devolver la promesa del nuevo token
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("refreshToken", objetoRecuperado.authoritation.refreshToken);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    return new Promise((resolve, reject) => {

        fetch(apiUrl, requestOptions)
            .then(response => {
                if (!response.ok) {
                   // console.log('error al recuperar el refresh token', error);
                    // Si el código de estado no está en el rango de 200, lanza un error
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                objetoRecuperado.authoritation = data;

                // Almacenar el objeto actualizado en el localStorage
                localStorage.setItem('miObjeto', JSON.stringify(objetoRecuperado));

                resolve(objetoRecuperado.authoritation.accessToken);
            })
            .catch(error => {
                if (error.message.includes('401')) {

                    // Aquí puedes manejar el código 401, por ejemplo, redirigir a la página de inicio de sesión
                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops',
                        text: 'La sesión ha expirado. Por favor, vuelve a iniciar sesión.',
                        showCancelButton: false,
                        confirmButtonColor: ' #d5c429 ',
                        confirmButtonText: 'Confirmar',
                    }).then((result) => {
                        localStorage.removeItem('miObjeto');
                        window.location.href = "./iniciosesion.html";
                    });
                   

                } else {
                    // Otras acciones para manejar errores distintos a 401
                    reject(error);
                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops',
                        text: 'ha ocurrido un error inesperado.'
                    });
                }
            });

    });
}




