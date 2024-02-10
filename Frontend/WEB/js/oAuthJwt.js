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
function handleAjaxRequest(ajaxRequestFunction) {
    var objetoRecuperado = JSON.parse(localStorage.getItem('miObjeto'));
    if (isTokenExpired(objetoRecuperado.authoritation.accessToken)) {
        // El token ha expirado, invocar la función para refrescar el token
        refreshAccessToken().then(newToken => {
            // Usar el nuevo token para realizar la solicitud
            ajaxRequestFunction(newToken);
        }).catch(error => {
            console.error('Error al intentar refrescar el token:', error);
            // Manejar el error de actualización del token
        });
    } else {
        // El token aún es válido, realizar la solicitud Ajax
        ajaxRequestFunction(objetoRecuperado.authoritation.accessToken);
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
            .then(response => response.json())
            .then(data => {
                console.log(data);
                objetoRecuperado.authoritation = data;

                // Almacenar el objeto actualizado en el localStorage
                localStorage.setItem('miObjeto', JSON.stringify(objetoRecuperado));

                resolve(data.newToken);
            })
            .catch(error => {
                console.log('error al recuperar el refresh token', error);
                reject(error);
            });

    });
}




