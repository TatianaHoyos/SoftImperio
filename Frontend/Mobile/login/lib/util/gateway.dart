import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:jwt_decode/jwt_decode.dart';
import 'host_server.dart';

// Asegúrate de importar AuthSingleton aquí
import 'auth_singleton.dart'; // Actualiza con el path correcto

class Gateway {
  final String baseUrl;
  final String refreshTokenUrl;
  int intentos;

  Gateway({

     this.baseUrl = host,
     this.refreshTokenUrl = host + "/edge-service/v1/authorization/refreshToken",
     this.intentos = 3
  });

  // Verificar la validez del JWT
  bool _isTokenExpired(String token) {
    try {
      return Jwt.isExpired(token);
    } catch (e) {
      // Manejar el caso de un token mal formado
      return true;
    }
  }

  // Obtener un nuevo accessToken usando refreshToken
  Future<void> _refreshToken() async {
    final refreshToken = AuthSingleton().authoritation.refreshToken;
    var headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  var body = {
    'refreshToken': refreshToken,
  };

  var response = await http.post(
    Uri.parse(refreshTokenUrl),
    headers: headers,
    body: body,
  );

    if (response.statusCode == 200) {
      intentos = 0;
      final data = json.decode(response.body);
      // Asegúrate de actualizar tanto el accessToken como el refreshToken si es necesario
      AuthSingleton().authoritation.accessToken = data['accessToken']; // Ajusta según tu API
      AuthSingleton().authoritation.refreshToken = data['refreshToken'];
      AuthSingleton().authoritation.tokenType = data['tokenType'];
    } else {
      intentos--;
      // Manejar errores o token de refresh inválido
      throw Exception('Failed to refresh token');
    }
  }

  // Método para hacer solicitudes HTTP con manejo de token
  Future<http.Response> makeRequest({
    required String endpoint,
    required String method,
    Map<String, String>? headers,
    dynamic body,
    bool isLogout = false
  }) async {
    var accessToken = AuthSingleton().authoritation.accessToken;

    if (_isTokenExpired(accessToken)) {
      await _refreshToken();
      accessToken = AuthSingleton().authoritation.accessToken; // Obtener el nuevo accessToken
    }

    final Uri url = Uri.parse('$baseUrl$endpoint');
    Map<String, String> defaultHeaders = {};
    if (isLogout) {
      body["accessToken"] = accessToken;
    } else {
    defaultHeaders = {
      'Authorization': 'Bearer $accessToken',
    };

    }
    
    http.Response response;

    // Combinar headers por defecto con los headers personalizados
    final combinedHeaders = {...?headers, ...defaultHeaders};

    // Realizar la solicitud HTTP según el método
    switch (method.toUpperCase()) {
      case 'POST':
        if (isLogout) {
          response = await http.post(url, headers: combinedHeaders, body: body);
        } else {
          response = await http.post(url, headers: combinedHeaders, body: json.encode(body));
        }
        break;
      case 'GET':
        response = await http.get(url, headers: combinedHeaders);
        break;
      case 'PUT':
        response = await http.put(url, headers: combinedHeaders, body: json.encode(body));
        break;
      case 'DELETE':
        response = await http.delete(url, headers: combinedHeaders);
        break;
      default:
        throw Exception('HTTP method not supported');
    }

    // Verificar si el accessToken fue rechazado y repetir la solicitud si es necesario
    if (response.statusCode == 401 && intentos != 0) {
      await _refreshToken();
      accessToken = AuthSingleton().authoritation.accessToken; // Obtener el nuevo accessToken
      return makeRequest(endpoint: endpoint, method: method, headers: headers, body: body, isLogout: isLogout); // Reintentar con el nuevo token
    }

    return response;
  }
}
