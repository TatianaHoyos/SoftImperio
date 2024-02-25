$(document).ready(function () {
    $("#resultadoCrear").hide();
    handleAjaxRequest(consultarProductos);
    buscarProductosTabla();
});


function mostrarFormularioCrear() {
    var titulo = $("#tituloFomularioProducto");
    titulo.text("Crear un nuevo productos");
    var btnform = $("#btn-form");
    btnform.text("Guardar");
    btnform.click(crearProducto);
}
function mostrarFormularioActualizar() {
    var titulo = $("#tituloFomularioProducto");
    titulo.text("Actualizar un producto");
    var btnform = $("#btn-form");
    btnform.text("Actualizar");

}


function crearProducto() {
    var form = $('#formCrearProducto')[0];

    // Create an FormData object 
    var formData = new FormData(form);

    console.log(formData);

    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "http://localhost:8080/api/producto/crear",
        data: formData,
        processData: false,
        contentType: false,
        success: onExitoCrearProducto,
        error: onErrorCrearProducto
    });

}

function onExitoCrearProducto(data) {
    console.log(data);
    // var mensaje = $("#resultadoCrear");
    // mensaje.addClass("alert-success");
    // mensaje.removeClass("alert-danger");
    // mensaje.show();
    // mensaje.text(data.message);
    Swal.fire({
        title: 'Exito',
        text: 'Producto creado Satisfactoriamente ',
        icon: 'succes',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
    
    $("#formCrearProducto").trigger("reset");
    $("#foto-preview").attr('src', '');
    handleAjaxRequest(consultarProductos);
    });
   
}
function onErrorCrearProducto(error) {
    console.log(error);
    // var mensaje = $("#resultadoCrear");
    // mensaje.addClass("alert-danger");
    // mensaje.removeClass("alert-success");
    // mensaje.show();
    // mensaje.text(error.message);
    Swal.fire({
        title: '¿Estás seguro de eliminar el producto?',
        text: 'Producto Eliminado ',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    })

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
    console.log(data);
// Destruir la DataTable existente si ya ha sido inicializada
    if ($.fn.DataTable.isDataTable('#tablaProductos')) {
        $('#tablaProductos').DataTable().destroy();
    }
    // Obtén una referencia a la DataTable
    var dataTable = $('#tablaProductos').DataTable({
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
            productos.existencia.cantidad,
            productos.precioProducto,
            boton1 +
            boton2
        ]).draw();

        // console.log(productos.id + ' ' + productos.nombreProducto + ' ' + productos.idCategoria + ' ' +
        //     productos.referenciaProducto + ' ' + productos.precioProducto);
    });
}


function onErrorProductos(error) {
    console.log(error)
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
            $.ajax({
                url: 'http://localhost:8080/api/producto/eliminar/' + Producto.idProductos,
                type: 'Delete',
                success: function (response) {
                    // Manejar la respuesta de eliminación exitosa
                    Swal.fire('Eliminado', response.message, 'success');
                    // Actualizar la tabla o realizar cualquier otra acción necesaria
                    handleAjaxRequest(consultarProductos);
                },
                error: function (xhr, status, error) {
                    // Manejar los errores de la solicitud AJAX
                    Swal.fire('Error', error.message, 'error');
                }
            });
        }
    });
}

function EditarProducto(producto) {
    mostrarFormularioActualizar();
    $("#categoria option[value=" + producto.idProductos + "]").attr("selected", true);
    $("#proveedor option[value=" + producto.idProveedores + "]").attr("selected", true);
    $("#nombre").val(producto.nombreProducto);
    $("#referencia").val(producto.referenciaProducto);
    $("#precio").val(producto.precioProducto);
    var preview = document.getElementById("foto-preview");
    preview.src = "http://localhost:8080/" + producto.fotoProducto;
    preview.style.display = "block";
    var btnform = $("#btn-form");
    btnform.click(function () { actualizarProducto(producto.idProductos); });

}

function actualizarProducto(idProductos) {
    var form = $('#formCrearProducto')[0];

    // Create an FormData object
    var formData = new FormData(form);

    console.log(formData);

    $.ajax({
        type: "Put",
        enctype: 'multipart/form-data',
        url: "http://localhost:8080/api/producto/actualizar/" + idProductos,
        data: formData,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log(response);
            Swal.fire({
              type: 'success',
              text: 'Registro actualizado',
              icon:"success",
              showConfirmButton: true,
            })
            setTimeout(() => {
              window.location.reload();
             }, 1500);
          },
          error: function(error) {
            console.log(error);
            Swal.fire({
              type: 'error',
              text: "No se pudo actualizar registro",
              icon: 'error',
              showConfirmButton: true,
            })
            setTimeout(() => {
              window.location.reload();
             }, 1500);
          }
        // success: onExitoCrearProducto,
        // error: onErrorCrearProducto
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