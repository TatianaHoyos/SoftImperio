import 'package:flutter/material.dart';

class MyButton extends StatelessWidget {
final Function()? onPressed; 
final String text;

  const MyButton({super.key, 
  required this.text,
  required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 25.0),
      child: ElevatedButton(onPressed: onPressed,
       child: Text(text),
       style: ElevatedButton.styleFrom(
        minimumSize: const Size.fromHeight(50),
        backgroundColor: Color.fromARGB(255, 149, 131, 9),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          
        )
       ),
       ),
    );
  }
}