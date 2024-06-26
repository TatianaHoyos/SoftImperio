var modulo = {
    "venta" : {
        "p_barra" : "./PuntoVentaBarra.html",
        "p_mesa" : "./puntoVentaMesa.html",
        "reporte" : "./ventas.html"
    },
    "credito" : {
        "usuario_credito": "./usuariocreditos.html",
    },
    "producto" : {
        "producto" : "./productos.html"
    },
    "usuario" : {
        "usuario" : "./Usuarios.html"        
    },
    "proveedor" : {
        "proveedor" : "./nuestrosProveedores.html"
    },
    "compra" : {
        "compra" : "./compras.html",
        "detalle" : "./comprasDetail.html"
    },
    "configuracion" : {
        "permiso" : "./Permisos.html",
        "inicio" : "./Inicio.html"
    }

};

let domainEC2 = "${DOMAIN-EC2}";
let domainS3 = "${DOMAIN-S3}";
var hostDomain = !domainEC2.includes("compute-1.amazonaws.com") ? "http://localhost:8081" : domainEC2;
var hostDomainImage = !domainS3.includes("s3.us-east-1.amazonaws.com") ? "http://localhost:8080" : domainS3;
var hostDomainNotificaciones = !domainEC2.includes("compute-1.amazonaws.com") ? "https://localhost:7084" : domainEC2;
