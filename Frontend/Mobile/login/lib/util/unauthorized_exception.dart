class UnauthorizedExcepcion implements Exception {
  final String mensaje;

  UnauthorizedExcepcion(this.mensaje);

  @override
  String toString() => mensaje;
}