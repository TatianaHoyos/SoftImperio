function crearExistencia() {
  
    document.getElementById('openModalBtn').addEventListener('click', function() {
      Swal.fire({
        title: 'Nuevo Producto',
        html:
        '<div style="margin: 10px;">' +
        '<label class="swal2-label" for="category" style="font-weight: bold;"></label>' +
          '<select id="category" class="swal2-select ">' +
          '<option value="">Seleccione una categoría</option>' +
          '<option value="opcion1">Cerveza</option>' +
          '<option value="opcion2">Aguardientes</option>' +
          '<option value="opcion3">Ron</option>' +
          '</select>' +
          '</div>' +

          '<div style="margin-bottom: 10px;">' +
          '<label class="swal2-label" for="category"></label>' +
          '<input type="text" id="name" placeholder="Ingrese nombre de producto" class="swal2-input text-white">' +

          '<div style="margin-bottom: 10px;">' +
          '<label class="swal2-label" for="category" style="font-weight: bold;"></label>' +
          '<input type="text" id="reference" placeholder="Referencia" class="swal2-input text-white">' +

          '<div style="margin-bottom: 10px;">' +
          '<label class="swal2-label" for="category"></label>' +
          '<input type="number" id="price" placeholder="Ingrese Precio" class="swal2-input text-white">' +

          '<div style="margin-bottom: 15px;">' +
          '<label class="swal2-label" for="category" style="font-weight: bold;"></label>' +
          '<input type="file" id="photo" class="swal2-file">',

        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        preConfirm: function () {
          return new Promise(function (resolve) {
            const category = document.getElementById('category').value;
            const name = document.getElementById('name').value;
            const reference = document.getElementById('reference').value;
            const price = document.getElementById('price').value;
            const photo = document.getElementById('photo').value;
            resolve({
              category: category,
              name: name,
              reference: reference,
              price: price,
              photo: photo
            });
          });
        }
      }).then(function (result) {
        if (result.isConfirmed) {
          const formData = result.value;
          console.log('Categoría: ' + formData.category);
          console.log('Nombre: ' + formData.name);
          console.log('Referencia: ' + formData.reference);
          console.log('Precio: ' + formData.price);
          console.log('Foto: ' + formData.photo);
          // Realizar cualquier acción adicional con los datos del formulario

          Swal.fire({
            title: '¡Enviado!',
            text: 'El producto se agrego correctamente.',
            icon: 'success'
          });
         
        
      }else if (result.dismiss === Swal.DismissReason.cancel) {
        // Aquí agregas la ventana emergente de cancelación
        Swal.fire({ title: 'Cancelado',
        text: 'El formulario ha sido cancelado.',
        icon: 'warning'
      })
    }
    })
    }
    );
   

}
// function editarExistencia() {
  
//   document.getElementById('editarExistencia').addEventListener('click', function() {
//     Swal.fire({
//       title: 'Editar Producto',
//       html:
//       '<div style="margin: 10px;">' +
//       '<label class="swal2-label" for="category" style="font-weight: bold;">Categoría:</label>' +
//         '<select id="category" class="swal2-select">' +
//         '<option value="">Seleccione una categoría</option>' +
//         '<option value="opcion1">Cerveza</option>' +
//         '<option value="opcion2">Aguardientes</option>' +
//         '<option value="opcion3">Ron</option>' +
//         '</select>' +
//         '</div>' +

//         '<div style="margin-bottom: 10px;">' +
//         '<label class="swal2-label" for="category" style="font-weight: bold;">Nombre:</label>' +
//         '<input type="text" id="name" placeholder="" class="swal2-input">' +

//         '<div style="margin-bottom: 10px;">' +
//         '<label class="swal2-label" for="category" style="font-weight: bold;">Referencia:</label>' +
//         '<input type="text" id="reference" placeholder="" class="swal2-input">' +

//         '<div style="margin-bottom: 10px;">' +
//       '<label class="swal2-label" for="category" style="font-weight: bold;">Precio:</label>' +
//         '<input type="number" id="price" placeholder="" class="swal2-input">' +

//         '<div style="margin-bottom: 15px;">' +
//       '<label class="swal2-label" for="category" style="font-weight: bold;">Foto:</label>' +
//         '<input type="file" id="photo" class="swal2-file">',
//       showCancelButton: true,
//       confirmButtonText: 'Guardar',
//       cancelButtonText: 'Cancelar',
//       preConfirm: function () {
//         return new Promise(function (resolve) {
//           const category = document.getElementById('category').value;
//           const name = document.getElementById('name').value;
//           const reference = document.getElementById('reference').value;
//           const price = document.getElementById('price').value;
//           const photo = document.getElementById('photo').value;
//           resolve({
//             category: category,
//             name: name,
//             reference: reference,
//             price: price,
//             photo: photo
//           });
//         });
//       }
//       }).then(function (result) {
//       if (result.isConfirmed) {
//         const formData = result.value;
//         console.log('Categoría: ' + formData.category);
//         console.log('Nombre: ' + formData.name);
//         console.log('Referencia: ' + formData.reference);
//         console.log('Precio: ' + formData.price);
//         console.log('Foto: ' + formData.photo);
//         // Realizar cualquier acción adicional con los datos del formulario

//         Swal.fire({
//           title: '¡Enviado!',
//           text: 'El producto se edito correctamente.',
//           icon: 'success'
//         });
    
           
//       } else if (result.dismiss === Swal.DismissReason.cancel) {
//         // Aquí agregas la ventana emergente de cancelación
//         Swal.fire({ title: 'Cancelado',
//         text: 'El formulario ha sido cancelado.',
//         icon: 'warning'
//       })
//     }

//     }
//   );
//   }
//   );
 

// }

// function eliminarExistencia() {
  
//   document.getElementById('eliminarExistencia').addEventListener('click', function() {
//     Swal.fire({
//       title: '¿Estás seguro?',
//       text: 'Esta acción no se puede deshacer',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Eliminar',
//       cancelButtonText: 'Cancelar'
//     }).then(function(result) {
//       if (result.isConfirmed) {
//         // Aquí puedes realizar la acción de eliminación
//         Swal.fire({
//           title: 'Eliminado',
//           text: 'El elemento ha sido eliminado.',
//           icon: 'success'
//         });
//       } else if (result.dismiss === Swal.DismissReason.cancel) {
//         Swal.fire({
//           title: 'Cancelado',
//           text: 'La eliminación ha sido cancelada.',
//           icon: 'info'
//         });
//       }
//     });
//   });
// }

function alertaEliminarEditar(accion, id) {
  if (accion === 'eliminar') {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then(function(result) {
      if (result.isConfirmed) {
        // Aquí realiza la acción de eliminación
        Swal.fire({
          title: 'Eliminado',
          text: 'El elemento ha sido eliminado.',
          icon: 'success'
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelado',
          text: 'La eliminación ha sido cancelada.',
          icon: 'info'
        });
      }
    });
  } else if (accion === 'editar') {
    // Lógica para editar la existencia correspondiente
    Swal.fire({
      title: 'Editar Producto',
      html:
      '<div style="margin: 10px;">' +
        '<label class="swal2-label" for="category" style="font-weight: bold;"></label>' +
          '<select id="category" class="swal2-select ">' +
          '<option value="">Seleccione una categoría</option>' +
          '<option value="opcion1">Cerveza</option>' +
          '<option value="opcion2">Aguardientes</option>' +
          '<option value="opcion3">Ron</option>' +
          '</select>' +
          '</div>' +

          '<div style="margin-bottom: 10px;">' +
          '<label class="swal2-label" for="category"></label>' +
          '<input type="text" id="name" placeholder="Ingrese nombre de producto" class="swal2-input text-white">' +

          '<div style="margin-bottom: 10px;">' +
          '<label class="swal2-label" for="category" style="font-weight: bold;"></label>' +
          '<input type="text" id="reference" placeholder="Referencia" class="swal2-input text-white">' +

          '<div style="margin-bottom: 10px;">' +
          '<label class="swal2-label" for="category"></label>' +
          '<input type="number" id="price" placeholder="Ingrese Precio" class="swal2-input text-white">' +

          '<div style="margin-bottom: 15px;">' +
          '<label class="swal2-label" for="category" style="font-weight: bold;"></label>' +
          '<input type="file" id="photo" class="swal2-file">',

      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: function () {
        return new Promise(function (resolve) {
          const category = document.getElementById('category').value;
          const name = document.getElementById('name').value;
          const reference = document.getElementById('reference').value;
          const price = document.getElementById('price').value;
          const photo = document.getElementById('photo').value;
          resolve({
            category: category,
            name: name,
            reference: reference,
            price: price,
            photo: photo
          });
        });
      }
      }).then(function (result) {
      if (result.isConfirmed) {
        const formData = result.value;
        console.log('Categoría: ' + formData.category);
        console.log('Nombre: ' + formData.name);
        console.log('Referencia: ' + formData.reference);
        console.log('Precio: ' + formData.price);
        console.log('Foto: ' + formData.photo);
        // Realizar cualquier acción adicional con los datos del formulario

        Swal.fire({
          title: '¡Enviado!',
          text: 'El producto se editó correctamente.',
          icon: 'success'
        });
    
           
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Aquí se agrega la ventana emergente de cancelación
        Swal.fire({ title: 'Cancelado',
        text: 'El formulario ha sido cancelado.',
        icon: 'warning'
      })
    }

    }
  );
  }

  
}

function crearExistencia() {
  
    document.getElementById('openModalBtn').addEventListener('click', function() {
      Swal.fire({
        title: 'Nuevo Producto',
        html:
        '<div style="margin: 10px;">' +
        '<label class="swal2-label" for="category" style="font-weight: bold;"></label>' +
          '<select id="category" class="swal2-select ">' +
          '<option value="">Seleccione una categoría</option>' +
          '<option value="opcion1">Cerveza</option>' +
          '<option value="opcion2">Aguardientes</option>' +
          '<option value="opcion3">Ron</option>' +
          '</select>' +
          '</div>' +

          '<div style="margin-bottom: 10px;">' +
          '<label class="swal2-label" for="category"></label>' +
          '<input type="text" id="name" placeholder="Ingrese nombre de producto" class="swal2-input text-white">' +

          '<div style="margin-bottom: 10px;">' +
          '<label class="swal2-label" for="category" style="font-weight: bold;"></label>' +
          '<input type="text" id="reference" placeholder="Referencia" class="swal2-input text-white">' +

          '<div style="margin-bottom: 10px;">' +
          '<label class="swal2-label" for="category"></label>' +
          '<input type="number" id="price" placeholder="Ingrese Precio" class="swal2-input text-white">' +

          '<div style="margin-bottom: 15px;">' +
          '<label class="swal2-label" for="category" style="font-weight: bold;"></label>' +
          '<input type="file" id="photo" class="swal2-file">',

        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        preConfirm: function () {
          return new Promise(function (resolve) {
            const category = document.getElementById('category').value;
            const name = document.getElementById('name').value;
            const reference = document.getElementById('reference').value;
            const price = document.getElementById('price').value;
            const photo = document.getElementById('photo').value;
            resolve({
              category: category,
              name: name,
              reference: reference,
              price: price,
              photo: photo
            });
          });
        }
      }).then(function (result) {
        if (result.isConfirmed) {
          const formData = result.value;
          console.log('Categoría: ' + formData.category);
          console.log('Nombre: ' + formData.name);
          console.log('Referencia: ' + formData.reference);
          console.log('Precio: ' + formData.price);
          console.log('Foto: ' + formData.photo);
          // Realizar cualquier acción adicional con los datos del formulario

          Swal.fire({
            title: '¡Enviado!',
            text: 'El producto se agrego correctamente.',
            icon: 'success'
          });
         
        
      }else if (result.dismiss === Swal.DismissReason.cancel) {
        // Aquí agregas la ventana emergente de cancelación
        Swal.fire({ title: 'Cancelado',
        text: 'El formulario ha sido cancelado.',
        icon: 'warning'
      })
    }
    })
    }
    );
   

}

function alertaEditar(accion, id) {
  if (accion === 'editar') {
  
    Swal.fire({
      title: 'Editar Proveedor',
      html:
          '<div style="margin-bottom: 10px;">' +
          '<label class="swal2-label" for="name"></label>' +
          '<input type="text" id="name" placeholder="Ingrese nombre" class="swal2-input text-white">' +

          '<div style="margin-bottom: 10px;">' +
          '<label class="swal2-label" for="documento" style="font-weight: bold;"></label>' +
          '<input type="number" id="documento" placeholder="Documento de identificación" class="swal2-input text-white">' +

          '<div style="margin-bottom: 10px;">' +
          '<label class="swal2-label" for="phone"></label>' +
          '<input type="tel" id="phone" placeholder="Ingrese Telefono" class="swal2-input text-white">' +

          '<div style="margin-bottom: 10px;">' +
          '<label class="swal2-label" for="email"></label>' +
          '<input type="email" id="email" placeholder="Correo electronico" class="swal2-input text-white">'+

          '<div style="margin-bottom: 10px;">' +
          '<label class="swal2-label" for="adress"></label>' +
          '<input type="text" id="adress" placeholder="Ingrese Dirección" class="swal2-input text-white">' ,
      
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: function () {
        return new Promise(function (resolve) {
          const name = document.getElementById('name').value;
          const documento = document.getElementById('documento').value;
          const phone = document.getElementById('phone').value;
          const email = document.getElementById('email').value;
          const adress = document.getElementById('adress').value;
          resolve({
            name: name,
            documento: documento,
            phone: phone,
            email: email,
            adress: adress
          });
        });
      }
      }).then(function (result) {
      if (result.isConfirmed) {
        const formData = result.value;
        console.log('Nombre: ' + formData.name);
        console.log('Documento: ' + formData.documento);
        console.log('Telefono: ' + formData.phone);
        console.log('email: ' + formData.email);
        console.log('Direccion: ' + formData.adress);
        // Realizar cualquier acción adicional con los datos del formulario

        Swal.fire({
          title: '¡Enviado!',
          text: 'El proveedor se editó correctamente.',
          icon: 'success'
        });
    
           
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Aquí se agrega la ventana emergente de cancelación
        Swal.fire({ title: 'Cancelado',
        text: 'El formulario ha sido cancelado.',
        icon: 'warning'
      })
    }

    }
  );
  }

  
}