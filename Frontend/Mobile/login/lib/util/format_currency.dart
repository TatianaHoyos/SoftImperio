import 'package:intl/intl.dart';

class FormatCurrency {

  static formatearMoneda(num valor) {
  var formatoMoneda = NumberFormat.currency(locale: 'es_CO', 
  symbol: '\$',
  decimalDigits: 0, // Especifica el número de decimales
    customPattern: '\u00a4 #,##0');
  return formatoMoneda.format(valor);
}

  num parsearMoneda(String valorMoneda) {
  var formatoMoneda = NumberFormat.currency(locale: 'es_CO', 
  symbol: '\$',
  decimalDigits: 0, 
    customPattern: '\u00a4 #,##0');
  try {
    var resultado = formatoMoneda.parse(valorMoneda);
    return resultado;
  } catch (e) {
    // Manejar cualquier error que pueda ocurrir durante el análisis
    print('Error al analizar el valor de moneda: $e');
    // Puedes lanzar una excepción o retornar un valor predeterminado según tus necesidades
    return 0.0; // Por ejemplo, retornar 0 en caso de error
  }
}
}