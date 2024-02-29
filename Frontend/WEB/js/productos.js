$(document).ready(function () {
    $("#resultadoCrear").hide();
    handleAjaxRequest(consultarProductos);
    handleAjaxRequest(consultarCategorias);
    
    buscarProductosTabla();
   
});


function mostrarFormularioCrear() {
    var titulo = $("#tituloFomularioProducto");
    titulo.text("Crear un nuevo producto");
    var btnform = $("#btn-form");
    // btnform.text("Guardar");
    // var product=  btnform.click(crearProducto);
    
        btnform.click(function (event) {
            event.preventDefault();  
            handleAjaxRequest(function (token) {
            crearProducto(token);
        });
        });
   
   
    
}
function mostrarFormularioActualizar() {
    var titulo = $("#tituloFomularioProducto");
    titulo.text("Actualizar un producto");
    var btnform = $("#btn-form");
    btnform.text("Actualizar");

}

function consultarCategorias(token) {
    $("#textCargando").text("Cargando Categorias");
    $.ajax({
        type: "GET",
        url: "http://localhost:8081/edge-service/v1/service/categorias/consultar",
        "headers": {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        success: onExitoCategorias,
        error: onErrorCategorias
    });
}

function onExitoCategorias(data) {
    categorias = data;
    var $dropdown = $("#idCategoria");
    // $dropdown.append($("<option />").val("-1").text("Todos"));
    $.each(data, function () {
        $dropdown.append($("<option />").val(this.idCategoria).text(this.nombreCategoria));
    });

}
function onErrorCategorias(error) {
    
    $("#cargando").modal("hide");
    Swal.fire({
        title: 'Error',
        text: error.responseJSON.message,
        icon:"warning",
        showCancelButton: false,
        confirmButtonColor: ' #d5c429 ',
        confirmButtonText: 'Confirmar',
    }).then((result) => {
       
    });
}

function crearProducto(token) {
    var idCategoria = $('#idCategoria').val();
    var nombreProducto = $('#nombre').val();
    var referenciaProducto = $('#referencia').val();
    var stockMinimo = $('#stockMinimo').val();
    var precioProducto = $('#precio').val();
    var fotoInput = $('#fotos')[0];
    var foto = fotoInput.files[0];

    var formData = new FormData();
    formData.append('idCategoria', idCategoria);
    formData.append('nombreProducto', nombreProducto);
    formData.append('referenciaProducto', referenciaProducto);
    formData.append('stockMinimo', stockMinimo);
    formData.append('precioProducto', precioProducto);
    formData.append('foto', foto);

    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "http://localhost:8081/edge-service/v1/service/productos/crear",
        'headers': {
           'Authorization': `Bearer ${token}`
        },
        data: formData,
        processData: false,
        contentType: false,
        success: onExitoCrearProducto,
        error: onErrorCrearProducto
    });
    return false;
}

function onExitoCrearProducto(data) {

   /* Swal.fire({
        title: 'Exito',
        text: data.message,
        type: 'success',
        icon:"success",
        showCancelButton: false,
        confirmButtonColor: ' #d5c429 ',
        confirmButtonText: 'Confirmar',
    }).then((result) => {
        //$("#formCrearProducto").trigger("reset");
        $("#foto-preview").attr('src', '');
        handleAjaxRequest(consultarProductos);
    });*/

    console.log(data);

}
function onErrorCrearProducto(error) {
    Swal.fire({
        title: 'Error',
        text: error.responseJSON.message,
        icon:"warning",
        showCancelButton: false,
        confirmButtonColor: ' #d5c429 ',
        confirmButtonText: 'Confirmar',
    }).then((result) => {
       
    });


}


function consultarProductos(token) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8081/edge-service/v1/service/productos/consultar",
        "headers": {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        success: onExitoProductos,
        error: onErrorProductos
    });
}

function onExitoProductos(data) {
// Destruir la DataTable existente si ya ha sido inicializada
    if ($.fn.DataTable.isDataTable('#tablaProductos')) {
        $('#tablaProductos').DataTable().destroy();
    }
    // Obtén una referencia a la DataTable
    var dataTable = $('#tablaProductos').DataTable({
        dom: '<"row"<"col-md-6"l><"col-md-6"f>>tip',
        pageLength: 5,
        lengthMenu: [5, 10, 25, 50], 
        language: {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst": "Primero",
                "sLast": "Último",
                "sNext": "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        },
        lengthMenu: [5, 10, 25, 50],
        pageLength: 5, // Número de registros por página
    });
    
    // Limpia la tabla
    dataTable.clear();

    // Recorre los datos y agrega las filas
    $.each(data, function (id, productos) {
        var nombreCategoria = "";
        if (productos.idCategoria == 1) {
            nombreCategoria = "cervezas";
        } else if (productos.idCategoria == 2) {
            nombreCategoria = "wiskey";
        } else if (productos.idCategoria == 3) {
            nombreCategoria = "aguardiente";
        }

        var boton1 = "<button onclick='EliminarProducto(" + JSON.stringify(productos) + ")' class='btn btn-eliminar' data-id='1'><i class='fas fa-trash'></i></button>";
        var boton2 = "<button onclick='EditarProducto(" + JSON.stringify(productos) + ")' class='btn btn-editar' data-toggle='modal' data-target='#formCrearProductos'><i class='fas fa-edit'></i></button>";

        // Agrega la fila a la DataTable
        dataTable.row.add([
            nombreCategoria,
            productos.nombreProducto,
            productos.referenciaProducto,
            productos.existencia.stock,
            productos.existencia.cantidad,
            productos.precioProducto,
            boton1 +
            boton2
        ]).draw();
    });
}


function onErrorProductos(error) {
    Swal.fire({
        title: 'Error',
        text: error.responseJSON.message,
        icon:"warning",
        showCancelButton: false,
        confirmButtonColor: ' #d5c429 ',
        confirmButtonText: 'Confirmar',
    }).then((result) => {
       
    });
}

function EliminarProducto(Producto) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta seguro de eliminar el producto ' + Producto.nombreProducto,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Realizar la solicitud de eliminación AJAX
            handleAjaxRequest(function (token) {
                callApiEliminarProducto(Producto,token);
            });
        }
    });
}

function callApiEliminarProducto(Producto,token){
    $.ajax({
        url: "http://localhost:8081/edge-service/v1/service/productos/eliminar/" + Producto.idProductos,
        type: 'DELETE',
        "headers": {
            
           'Authorization': `Bearer ${token}`
        },
        success: function (response) {
            // Manejar la respuesta de eliminación exitosa
            Swal.fire('Eliminado', response.message, 'success');
            // Actualizar la tabla o realizar cualquier otra acción necesaria
            handleAjaxRequest(consultarProductos);
        },
        error: function (xhr, status, error) {
            // Manejar los errores de la solicitud AJAX
            Swal.fire('Error', error.responseJSON.message, 'error');
        }
    });
}

function EditarProducto(producto) {
    mostrarFormularioActualizar();
    $("#categoria option[value=" + producto.idProductos + "]").attr("selected", true);
    $("#proveedor option[value=" + producto.idProveedores + "]").attr("selected", true);
    $("#nombre").val(producto.nombreProducto);
    $("#referencia").val(producto.referenciaProducto);
    $("#stockMinimo").val(producto.existencia.stock);
    $("#precio").val(producto.precioProducto);
    var preview = document.getElementById("foto-preview");
    preview.src = "http://localhost:8080/" + producto.fotoProducto;
    preview.style.display = "block";
    var btnform = $("#btn-form");
    
        btnform.click(function (event) {
            event.preventDefault();  
            handleAjaxRequest(function (token) {
            actualizarProducto(producto.idProductos,token);
            return false;
        });
        });
    
    // btnform.click(function () { actualizarProducto(producto.idProductos); });

}

function actualizarProducto(idProductos,token) {
    var idCategoria = $('#idCategoria').val();
    var nombreProducto = $('#nombre').val();
    var referenciaProducto = $('#referencia').val();
    var stockMinimo = $('#stockMinimo').val();
    var precioProducto = $('#precio').val();
    var fotoInput = $('#fotos')[0];
    var foto = fotoInput.files[0];

    var formData = new FormData();
    formData.append('idCategoria', idCategoria);
    formData.append('nombreProducto', nombreProducto);
    formData.append('referenciaProducto', referenciaProducto);
    formData.append('stockMinimo', stockMinimo);
    formData.append('precioProducto', precioProducto);
    formData.append('foto', foto);

    $.ajax({
        type: "Put",
        enctype: 'multipart/form-data',
        url: "http://localhost:8081/edge-service/v1/service/productos/actualizar/" + idProductos,
          "headers": {
            'Authorization': `Bearer ${token}`
        },
        data: formData,
        processData: false,
        contentType: false,
         success: onExitoCrearProducto,
         error: onErrorCrearProducto
    });
}
function buscarProductosTabla() {
    $("#consultarTabla").keyup(function () {
        _this = this;
        // Show only matching TR, hide rest of them
        $.each($("#miTabla tbody tr"), function () {
            if ($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)
                $(this).hide();
            else
                $(this).show();
        });
    });
}