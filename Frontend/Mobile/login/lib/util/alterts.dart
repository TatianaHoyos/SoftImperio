import 'package:flutter/material.dart';
import 'package:login/infraestructura/models/response.dart';

class Alert {

  static void mostrarAlerta(
    BuildContext context,
    Response response,
    Function() onPressed,
  ) {
      final IconData icon;
  switch (response.status.toLowerCase()) {
    case "informativo":
      icon = Icons.info;
      break;
    case "error":
      icon = Icons.error;
      break;
    case "warning":
      icon = Icons.warning;
      break;
    default:
      icon = Icons.done; // Default icon for unknown status
  }

  showDialog(
    context: context,
    builder: (BuildContext context) {
      return AlertDialog(
        title: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 40.0,),
            SizedBox(width: 10.0), // Add spacing between icon and title
            Text(response.status),
          ],
        ),
          content: Text(response.message),
          actions: [
            ElevatedButton(
              onPressed: onPressed,
              child: Text('Aceptar'),
            ),
          ],
        );
      },
    );
  }
}
