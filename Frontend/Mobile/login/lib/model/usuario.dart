class Usuario {
  final String nombre;
  final String documento;
  final String correo;
  final String telefono;

  Usuario({
    required this.nombre,
    required this.documento,
    required this.correo,
    required this.telefono,
  });
}

final listaUsuarios = [
    Usuario(nombre: 'azul',documento: '1002345678',correo: 'azul@gmail.com',telefono: '5555'),
    Usuario(nombre: 'Morado',documento: '1002345678',correo: 'azul@gmail.com',telefono: '5555'),
    Usuario(nombre: 'verde',documento: '1002345678',correo: 'azul@gmail.com',telefono: '5555'),
    Usuario(nombre: 'negro',documento: '1002345678',correo: 'azul@gmail.com',telefono: '5555'),

  ];