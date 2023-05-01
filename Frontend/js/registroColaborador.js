
$(document).ready(function () {
    consultarRoles();
});

function consultarRoles() {
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/api/roles",
        "headers": {
            "Content-Type": "application/json"
          },
        success: onExitoRoles,
        error: onErrorRoles
    });
}

function onExitoRoles(data) {
    console.log(data);
    var $dropdown = $("#roles");
    $.each(data, function () {
        $dropdown.append($("<option />").val(this.idRol).text(this.nombreRol));
    });

}
function onErrorRoles(error) {
    console.log(error)
}
