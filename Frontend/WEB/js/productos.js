var idProductoAactualizar = -1;
$(document).ready(function () {
    $("#resultadoCrear").hide();
    handleAjaxRequest(consultarProductos);
    buscarProductosTabla();
    $("#btn-form").click(function () {
        crearOActualizarProducto();
 });
});


function mostrarFormularioCrear() {
    var titulo = $("#tituloFomularioProducto");
    titulo.text("Crear un nuevo producto");
    var btnform = $("#btn-form");
    btnform.text("Guardar");
    $('#formCrearProducto')[0].reset();
    var imgPreview = document.getElementById("foto-preview");

// Limpiar la propiedad src de la etiqueta de imagen
    imgPreview.src = "";
   
    
}


function crearOActualizarProducto() {
    var btnform = $("#btn-form");
    if (btnform.text() == "Actualizar"){
        handleAjaxRequest(function (token) {
            actualizarProducto(idProductoAactualizar,token);
        });
    } else {
        idProductoAactualizar = -1;
        handleAjaxRequest(function (token) {
            crearProducto(token);
        });
    }
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
        url: hostDomain+"/edge-service/v1/service/productos/crear",
        'headers': {
           'Authorization': `Bearer ${token}`
        },
        data: formData,
        processData: false,
        contentType: false,
        success: onExitoCrearProducto,
        error: onErrorCrearProducto
    });
}

function onExitoCrearProducto(data) {
    $("#formCrearProductos").modal("hide");
    Swal.fire({
        title: 'Éxito',
        text: data.message,
        type: 'success',
        icon:"success",
        showCancelButton: false,
        confirmButtonColor: ' #d5c429 ',
        confirmButtonText: 'Confirmar',
    }).then((result) => {
        $("#formCrearProducto").trigger("reset");
        $("#foto-preview").attr('src', '');
        handleAjaxRequest(consultarProductos);
    });

    // console.log(data);

}
function onErrorCrearProducto(error) {
    $("#formCrearProductos").modal("hide");
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
        url: hostDomain+"/edge-service/v1/service/productos/consultar",
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

        var boton1 = "<button onclick='EliminarProducto(" + JSON.stringify(productos) + ")' class='btn btn-eliminar' data-id='1'><i class='fas fa-trash'></i></button>";
        var boton2 = "<button onclick='EditarProducto(" + JSON.stringify(productos) + ")' class='btn btn-editar' data-toggle='modal' data-target='#formCrearProductos'><i class='fas fa-edit'></i></button>";

        // Agrega la fila a la DataTable
        dataTable.row.add([
           productos.nombreCategoria,
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
    var message = "";
    if (error.responseJSON.hasOwnProperty('errors')) {
        message = error.responseJSON.errors[0].message;
    } else {
        message = error.responseJSON.message;
    }
    Swal.fire({
        title: 'Error',
        text: message,
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
        text: '¿Está seguro de eliminar el producto ' + Producto.nombreProducto,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d5c429',
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
        url: hostDomain+"/edge-service/v1/service/productos/eliminar/" + Producto.idProductos,
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
            Swal.fire('Error', xhr.responseJSON.message, 'error');
        }
    });
}

function EditarProducto(producto) {
    var titulo = $("#tituloFomularioProducto");
    titulo.text("Actualizar un producto");
    var btnform = $("#btn-form");
    btnform.text("Actualizar");
    $("#categoria option[value=" + producto.idProductos + "]").attr("selected", true);
    $("#proveedor option[value=" + producto.idProveedores + "]").attr("selected", true);
    $("#nombre").val(producto.nombreProducto);
    $("#referencia").val(producto.referenciaProducto);
    $("#stockMinimo").val(producto.existencia.stock);
    $("#precio").val(producto.precioProducto);
    var preview = document.getElementById("foto-preview");
    preview.src = hostDomainImage+"/" + producto.fotoProducto;
    preview.style.display = "block";
   idProductoAactualizar = producto.idProductos;
}

function actualizarProducto(idProductos,token) {
    var form = $('#formCrearProducto')[0];
    // Create an FormData object 
    var formData = new FormData(form);

    $.ajax({
        type: "Put",
        enctype: 'multipart/form-data',
        url: hostDomain+"/edge-service/v1/service/productos/actualizar/" + idProductos,
          "headers": {
            'Authorization': `Bearer ${token}`
        },
        data: formData,
        processData: false,
        contentType: false,
         success: onExitoCrearProducto,
         error: onErrorCrearProducto
    });
    idProductoAactualizar = -1;
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

function generarPDFProductos(){
    handleAjaxRequest(callApiGenerarPdf);
}


function callApiGenerarPdf(token){
      $.ajax({
        type: "GET",
        url: hostDomain+"/edge-service/v1/service/productos/pdf",
        "headers": {
          'Authorization': `Bearer ${token}`,
          'target' : 'pdf'
      },
        xhrFields: {
          responseType: 'arraybuffer' // Indica que esperamos un array de bytes como respuesta
        },
        success: function (response, status, xhr) {
          if (xhr.status === 200) {
            // Crea un objeto Blob con la respuesta y tipo de contenido PDF
            
            const blob = new Blob([response], { type: 'application/pdf' });
    
            // Crea una URL de objeto para el blob
            const blobURL = URL.createObjectURL(blob);
    
            // Crea un enlace invisible para descargar el PDF
            const link = document.createElement('a');
            link.href = blobURL;
            link.download = 'Productos.pdf'; // Puedes cambiar el nombre del archivo si es necesario
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    
            // Libera la URL de objeto después de unos segundos (puedes ajustar el tiempo)
            setTimeout(() => {
              URL.revokeObjectURL(blobURL);
            }, 5000); // 5000 milisegundos (5 segundos) como ejemplo
          } else {
           
            Swal.fire({
              title: 'Error',
              text: `Error en la respuesta del servidor. Código de estado: ${xhr.status}`,
              icon:"warning",
              showCancelButton: false,
              confirmButtonColor: ' #ae9243 ',
              confirmButtonText: 'Confirmar',
          }).then((result) => {
             
          });
          }
        },
        error: function (error) {
          // Manejar el error
          Swal.fire({
            title: 'Error',
            text: 'Error en la respuesta',
            icon:"warning",
            showCancelButton: false,
            confirmButtonColor: ' #ae9243 ',
            confirmButtonText: 'Confirmar',
        }).then((result) => {
           
        });
        }
      });
    }