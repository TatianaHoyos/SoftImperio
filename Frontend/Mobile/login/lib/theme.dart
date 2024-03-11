import 'package:flutter/material.dart';
import 'package:login/components/colors.dart';


class AppTheme {
  get theme {
    return ThemeData(
      brightness: Brightness.light,
      primaryColor: Color(0xFF7bbabb),
      primaryColorLight: Color(0xFFAE9243),
      appBarTheme: AppBarTheme(backgroundColor: Colors.white.withOpacity(0.2)),
      // accentColor: Color(0xFF287a84),
      // Define the default font family.
      // fontFamily: 'steady',
      // backgroundColor: Colors.grey,
      //#aecdcf
      //#6cb3b2
      scaffoldBackgroundColor: Color(0xFF2e3037),//2E3037

      // Define the default TextTheme. Use this to specify the default
      // text styling for headlines, titles, bodies of text, and more.
      // textTheme: GoogleFonts.darkerGrotesqueTextTheme(),
      // bottomsheet background transparent
      canvasColor: Color(0xFF2e3037),

      visualDensity: VisualDensity.adaptivePlatformDensity,
    );
  }
}