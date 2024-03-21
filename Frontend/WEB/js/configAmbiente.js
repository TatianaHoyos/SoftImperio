var modulo = {
    "venta" : {
        "p_barra" : "./PuntoVentaBarra.html",
        "p_mesa" : "./puntoVentaMesa.html",
        "reporte" : "./ventas.html"
    },
    "credito" : {
        "credito" : "./creditos.html",
        "usuario_credito": "./usuarioCreditos.html",
        "nuevo_usuario_credito": "./nuevoCredito.html"
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
        "permiso" : "./permisos.html",
        "inicio" : "./inicio.html"
    }

};

let domainEC2 = "${DOMAIN-EC2}";

var hostDomain = domainEC2 == "${DOMAIN-EC2}" ? "http://localhost:8081" : domainEC2;