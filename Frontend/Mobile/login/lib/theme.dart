import 'package:flutter/material.dart';
import 'package:login/components/colors.dart';


class AppTheme {
  get theme {
    return ThemeData(
      primaryColor: Colors.black,
      primaryColorLight: Color(0xFFAE9243),
      appBarTheme: AppBarTheme(backgroundColor: Colors.white.withOpacity(0.2)),
      useMaterial3: true,

    // Define the default brightness and colors.
    colorScheme: ColorScheme.fromSeed(
      seedColor: Colors.blueGrey,
      primary: Colors.white,
      brightness: Brightness.light,
    ),
      scaffoldBackgroundColor: Color(0xFF2e3037),//2E3037

      // Define the default TextTheme. Use this to specify the default
      // text styling for headlines, titles, bodies of text, and more.
      // textTheme: GoogleFonts.darkerGrotesqueTextTheme(),
      // bottomsheet background transparent
      canvasColor: Color(0xFF2e3037),

      visualDensity: VisualDensity.adaptivePlatformDensity,
       elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          elevation: 5.0,
          /*shadowColor: Colors.green,
          backgroundColor: Colors.green,
          disabledBackgroundColor: Colors.green.withOpacity(0.4),
          disabledForegroundColor: Colors.grey,
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),*/
          textStyle: const TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold, color: Colors.white),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
        ),
      )
    );
  }
}