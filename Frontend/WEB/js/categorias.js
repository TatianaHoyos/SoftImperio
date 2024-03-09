$(document).ready(function () {
    $("#resultadoCrear").hide();
});

function consultarCategorias(token) {
    //$("#textCargando").text("Cargando Categorias");
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

    if ($.fn.DataTable.isDataTable('#tablaCategoria')) {
        $('#tablaCategoria').DataTable().destroy();
    }
    
    // Obtén una referencia a la DataTable de Categorías
    var dataTableCategorias = $('#tablaCategoria').DataTable({
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
    
    // Limpia la tabla de Categorías
    dataTableCategorias.clear();
    
    // Recorre los datos y agrega las filas
    $.each(data, function (id,categoria) {
        
        var boton1 = "<button onclick='EliminarCategoria(" + JSON.stringify(categoria) + ")' class='btn btn-eliminar' data-id='1'><i class='fas fa-trash'></i></button>";
        var boton2 = "<button onclick='EditarCategoria(" + JSON.stringify(categoria) + ")' class='btn btn-editar' data-toggle='modal' data-target='#formCrearProductos'><i class='fas fa-edit'></i></button>";

        // Agrega la fila a la DataTable de Categorías
        dataTableCategorias.row.add([
            categoria.idCategoria,
            categoria.nombreCategoria,
            boton1 +
            boton2
        ]).draw();
        // var $tabla = $("#tablaCategoria tbody");
        
        // // Limpiar contenido existente en la tabla
        // $tabla.empty();

        // $.each(data, function () {
        //     var row = $("<tr>");
        //     row.append($("<td>").text(this.idCategoria));
        //     row.append($("<td>").text(this.nombreCategoria));
        //     var boton1 = "<button onclick='EliminarCategoria(" + JSON.stringify(categoria) + ")' class='btn btn-eliminar' data-id='1'><i class='fas fa-trash'></i></button>";
        //     var boton2 = "<button onclick='EditarCategoria(" + JSON.stringify(categoria) + ")' class='btn btn-editar' data-toggle='modal' data-target='#formCrearProductos'><i class='fas fa-edit'></i></button>";
        

        //     // Puedes agregar acciones adicionales aquí si es necesario

        //     $tabla.append(row);
    });
        
}
function onErrorCategorias(error) {
  // $("#cargando").modal("hide");
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

function mostrarFormularioCrearCategoria(){
    var titulo = $("#tituloFomularioCategoria");
    titulo.text("Crear una nueva Categoría");
    var btnform = $("#btn-form");
    btnform.text("Guardar");
   //btnform.click(crearRol);
   $("#operacionCategoria").val("crearCategoria");
  
  // btnform.click(function(){ crearRol(); });
}

function crearCategoria(){
    var formData = {
       nombreCategoria:$("#nombreCategoria").val(),
    
    };
    handleAjaxRequest(function (token) {
        callApiCrearCategoria(formData, token);
    });

}

function callApiCrearCategoria(formData,token){

    $.ajax({
        type: "POST",
        url:"http://localhost:8081/edge-service/v1/service/categorias/crear",
        "headers": {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(formData),
        success: onExitoCrearCategoria,
        error: onExitoCrearCategoria
   });
}
function onExitoCrearCategoria(data){
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-success");
    mensaje.removeClass("alert-danger");
    mensaje.show();
    mensaje.text(data.message);
//     $("#formCrearRol").trigger("reset");
//    handleAjaxRequest(consultarRoles);
}
function onExitoCrearCategoria(error){
    console.log(error);
    var mensaje = $("#resultadoCrear");
    mensaje.addClass("alert-danger");
    mensaje.removeClass("alert-success");
    mensaje.show();
    mensaje.text(error.message);
}
function eventoFormularioCategoria(){
    var operacion=$("#operacionCategoria").val();
    if(operacion=="crearCategoria"){
        crearCategoria();
    }
}