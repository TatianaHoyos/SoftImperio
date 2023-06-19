$(document).ready(function () {
  $("#resultadoCrear").hide();
    consultarProductos();

});

function mostrarFormularioCrear(){
    var titulo = $("#tituloFomularioProducto");
    titulo.text("Crear un nuevo productos");
    var btnform = $("#btn-form");
    btnform.text("Guardar");
    btnform.click(crearProducto);
}
function mostrarFormularioActualizar(){
    var titulo = $("#tituloFomularioProducto");
    titulo.text("Actualizar un producto");
    var btnform = $("#btn-form");
    btnform.text("Actualizar");
   
}


function crearProducto(){
    var form = $('#formCrearProducto')[0];

	// Create an FormData object 
    var formData = new FormData(form);

   console.log(formData);

   $.ajax({
    type: "POST",
    enctype: 'multipart/form-data',
    url:"http://localhost:8080/api/producto/crear",
    data: formData,
    processData: false,
    contentType: false,
    success: onExitoCrearProducto,
    error: onErrorCrearProducto
});

}

function onExitoCrearProducto(data){
    console.log(data);
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-success");
    mensaje.removeClass("alert-danger");
    mensaje.show();
    mensaje.text(data.message);
    $("#formCrearProducto").trigger("reset");
    $("#foto-preview").attr('src', '');
    consultarProductos();
}
function onErrorCrearProducto(error){
    console.log(error);
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-danger");
    mensaje.removeClass("alert-success");
    mensaje.show();
    mensaje.text(error.message);
}


function consultarProductos() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/producto/consultar",
        "headers": {
            "Content-Type": "application/json"
          },
        success: onExitoProductos,
        error: onErrorProductos
    });
}

function onExitoProductos(data) {
    console.log(data);
   
$('#tablaProductos > tbody').empty();
$.each(data, function(id, productos) {
    //alert('Estoy recorriendo el registro numero: ' + idx);
    var nombreCategoria="";
    if(productos.idCategoria==1){
        nombreCategoria="cervezas";
    } else if(productos.idCategoria==2){
        nombreCategoria="aguardientes";
    }else if(productos.idCategoria==3){
        nombreCategoria="wiskey";
    }

    var boton1 = "<button onclick='EliminarProducto("+ JSON.stringify(productos) +")' class='btn btn-delete' data-id='1'><i class='fas fa-trash'></i></button>";
    var boton2 = "<button onclick='EditarProducto("+ JSON.stringify(productos) +")' class='btn btn-edit' data-toggle='modal' data-target='#formCrearProductos'><i class='fas fa-edit'></i></button>";

    $('#tablaProductos').append('<tr><td>' + nombreCategoria + '</td><td>' + productos.nombreProducto + '</td><td>'+ productos.referenciaProducto + '</td><td>' + productos.cantidad + '</td><td>' + productos.precioProducto + 
    '</td><td>' + boton1 + '</td><td>' + boton2 + '</td></tr>');
    console.log(productos.id + ' ' + productos.nombreProducto + ' ' + productos.idCategoria + ' ' +
     productos.referenciaProducto + ' ' + productos.precioProducto);
     
});
    

}
function onErrorProductos(error) {
    console.log(error)
}

function EliminarProducto(Producto){
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta seguro de eliminar el producto '+ Producto.nombreProducto,
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
                url: 'http://localhost:8080/api/producto/eliminar/'+Producto.idProductos,
                type: 'Delete',
                success: function(response) {
                    // Manejar la respuesta de eliminación exitosa
                    Swal.fire('Eliminado',response.message, 'success');
                    // Actualizar la tabla o realizar cualquier otra acción necesaria
                    consultarProductos();
                },
                error: function(xhr, status, error) {
                    // Manejar los errores de la solicitud AJAX
                    Swal.fire('Error', error.message, 'error');
                }
            });
        }
    });
}

function EditarProducto(producto){
    mostrarFormularioActualizar();
    $("#categoria option[value='"+ producto.idProductos +"']").attr("selected", true);
    $("#proveedor option[value='"+ producto.idProveedores +"']").attr("selected", true);
    $("#nombre").val(producto.nombreProducto);
    $("#referencia").val(producto.referenciaProducto);
    $("#precio").val(producto.precioProducto);
    var preview = document.getElementById("foto-preview");
    preview.src = "http://localhost:8080/"+producto.fotoProducto;
    preview.style.display = "block";
    var btnform = $("#btn-form");
    btnform.click(function(){ actualizarProducto(producto.idProductos); });
   
}

function actualizarProducto(idProductos){
    var form = $('#formCrearProducto')[0];

	// Create an FormData object 
    var formData = new FormData(form);

   console.log(formData);

   $.ajax({
    type: "Put",
    enctype: 'multipart/form-data',
    url:"http://localhost:8080/api/producto/actualizar/"+idProductos,
    data: formData,
    processData: false,
    contentType: false,
    success: onExitoCrearProducto,
    error: onErrorCrearProducto
});
}
