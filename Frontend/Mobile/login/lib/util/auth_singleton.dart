import '../infraestructura/models/usuario.dart';

class AuthSingleton {
  // Inicializar TokenData con valores predeterminados
  Authoritation _authoritation = Authoritation(accessToken: '', tokenType: '', refreshToken: '');

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

  // Método para actualizar los tokens
  void updateTokenData({required String accessToken, required String tokenType, required String refreshToken}) {
    _authoritation = Authoritation(accessToken: accessToken, tokenType: tokenType, refreshToken: refreshToken);
  }

  // Método para limpiar los tokens
  void clearTokens() {
    _authoritation = Authoritation(accessToken: '', tokenType: '', refreshToken: '');
  }
}
