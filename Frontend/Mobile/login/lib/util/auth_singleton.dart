import '../infraestructura/models/usuario.dart';

class AuthSingleton {
  // Inicializar TokenData con valores predeterminados
  Authoritation _authoritation = Authoritation(accessToken: '', tokenType: '', refreshToken: '');
  String _nombre = "";
  String _urlFoto = "";
  String _rol ="";

  // Constructor privado
  AuthSingleton._privateConstructor();

  // Instancia estática privada
  static final AuthSingleton _instance = AuthSingleton._privateConstructor();

  // Fábrica para acceder a la instancia
  factory AuthSingleton() {
    return _instance;
  }

  // Getter público para TokenData
  Authoritation get authoritation => _authoritation;
  String get nombre => _nombre;
  String get foto => _urlFoto;
  String get rol => _rol;

  // Método para actualizar los tokens
  void updateTokenData({required String accessToken, required String tokenType, required String refreshToken}) {
    _authoritation = Authoritation(accessToken: accessToken, tokenType: tokenType, refreshToken: refreshToken);
  }

  void updateUserData({required String nombre, required String foto, required String rol}){
    _nombre = nombre;
    _urlFoto = foto;
    _rol = rol;
  }

  // Método para limpiar los tokens
  void clearTokens() {
    _authoritation = Authoritation(accessToken: '', tokenType: '', refreshToken: '');
  }
}
