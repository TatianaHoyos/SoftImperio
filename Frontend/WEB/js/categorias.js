$(document).ready(function () {
    $("#resultadoCrear").hide();
    handleAjaxRequest(consultarCategorias);
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

function onExitoCategoriasDropDown(data) {
    categorias = data;
    var $dropdown = $("#idCategoria");
    // $dropdown.append($("<option />").val("-1").text("Todos"));
    $.each(data, function () {
        $dropdown.append($("<option />").val(this.idCategoria).text(this.nombreCategoria));
    });

}

function onExitoCategoriasTable(data){
    if ($.fn.DataTable.isDataTable('#tablaCategoria')) {
        $('#tablaCategoria').DataTable().destroy();
    }
    
    // Obtén una referencia a la DataTable de Categorías
    var dataTableCategorias = $('#tablaCategoria').DataTable({
        dom: '<"row"<"col-md-6"l><"col-md-6"f>>tip',
        pageLength: 3,
        lengthMenu: [3, 5, 10, 25, 50], 
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
        }
    });
    
    // Limpia la tabla de Categorías
    dataTableCategorias.clear();
    
    // Recorre los datos y agrega las filas
    $.each(data, function (id,categoria) {
        
        var boton1 = "<button onclick='EliminarCategoria(" + JSON.stringify(categoria) + ")' class='btn btn-eliminar' data-id='1'><i class='fas fa-trash'></i></button>";
        var boton2 = "<button onclick='EditarCategoria(" + JSON.stringify(categoria) + ")' class='btn btn-editar' ><i class='fas fa-edit'></i></button>";

        // Agrega la fila a la DataTable de Categorías
        dataTableCategorias.row.add([
            categoria.idCategoria,
            categoria.nombreCategoria,
            boton1 +
            boton2
        ]).draw();
      
    });
}

function onExitoCategorias(data) {
    onExitoCategoriasDropDown(data);
    onExitoCategoriasTable(data);

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
    var btnform = $("#btn-form-categoria");
    btnform.text("Guardar");
   //btnform.click(crearRol);
   $("#operacionCategoria").val("crearCategoria");
   $("#idCategoriaActualizar").val("");
  // btnform.click(function(){ crearRol(); });
 
}

function crearCategoria(){
    var formData = {
        nombreCategoria:$("#nombreCategoria").val(),
     };
     if (validarCampoVacio($("#nombreCategoria").val().length, 'Por favor ingrese un nombre a la categoría')) {
        return false;
    }
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
        error: onErrorCrearCategoria
   });
}
function onExitoCrearCategoria(data){
    $("#formCrearCategoria").modal("hide");
    mostrarFormularioGuardar();
    Swal.fire({
        title: 'Exito',
        text: data.message,
        type: 'success',
        icon:"success",
        showCancelButton: false,
        confirmButtonColor: ' #d5c429 ',
        confirmButtonText: 'Confirmar',
    }).then((result) => {
       
    });
    handleAjaxRequest(consultarCategorias);
}
function onErrorCrearCategoria(error){
    $("#formCrearCategoria").modal("hide");
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
function eventoFormularioCategoria(){

    var operacion=$("#operacionCategoria").val();
    if(operacion=="crearCategoria"){
       
        crearCategoria();
       
    }else{
        actualizarCategoria();
    }
}


function EliminarCategoria(categoria) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta seguro de eliminar la categoria ' + categoria.nombreCategoria,
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
                callApiEliminarCategoria(categoria,token);
            });
        }
    });
}

function callApiEliminarCategoria(categoria,token){
    $.ajax({
        url: "http://localhost:8081/edge-service/v1/service/categorias/eliminar/" + categoria.idCategoria,
        type: 'DELETE',
        "headers": {
           'Authorization': `Bearer ${token}`
        },
        success: function (response) {
            // Manejar la respuesta de eliminación exitosa
            $("#operacionCategoria").val("crearCategoria");
            Swal.fire('Eliminado', response.message, 'success');
            // Actualizar la tabla o realizar cualquier otra acción necesaria
            handleAjaxRequest(consultarCategorias);
        },
        error: function (xhr, status, error) {
            // Manejar los errores de la solicitud AJAX
            Swal.fire('Error', xhr.responseJSON.message, 'error');
        }
    });
}

function mostrarFormularioActualizar(){
    $("#operacionCategoria").val("actualizarCategoria");
    var titulo = $("#tituloFomularioCategoria");
    titulo.text("Actualizar categoria");
    var btnform = $("#btn-form-categoria");
    btnform.text("Actualizar");
    
   
}

function mostrarFormularioGuardar(){
    $("#nombreCategoria").val("");
    var titulo = $("#tituloFomularioCategoria");
    titulo.text("Guardar categoria");
    var btnform = $("#btn-form-categoria");
    btnform.text("Guardar");
   
}

function EditarCategoria(categoria) {
    mostrarFormularioActualizar();
    $("#nombreCategoria").val(categoria.nombreCategoria);
    $("#idCategoriaActualizar").val(categoria.idCategoria);
    window.scrollTo(0, 0);
    $("#nombreCategoria").focus();
}

function actualizarCategoria() {
    var formData = {
        nombreCategoria:$("#nombreCategoria").val(),
        idCategoria : $("#idCategoriaActualizar").val()
     };
 
     handleAjaxRequest(function (token) {
        callApiActualizarCategoria(formData, token);
     });
   
function callApiActualizarCategoria(formData, token){
    $.ajax({
        type: "PUT",
        url: "http://localhost:8081/edge-service/v1/service/categorias/actualizar/" + formData.idCategoria,
          "headers": {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        data: JSON.stringify(formData),
         success: onExitoCrearCategoria,
         error: onErrorCrearCategoria
    });
}
}
