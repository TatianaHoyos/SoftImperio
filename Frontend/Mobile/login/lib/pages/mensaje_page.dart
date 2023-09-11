import 'package:flutter/material.dart';

class Mensaje extends StatelessWidget {
  const Mensaje({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: SafeArea(
        child:Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text('los gatos',  style: TextStyle(color: Color.fromARGB(255, 39, 89, 136), fontSize: 16)),
              Image(
               image: NetworkImage('https://media.ambito.com/p/67e1cdc69057c1863724eddcd8269faa/adjuntos/239/imagenes/040/456/0040456799/gatos-portadajpg.jpg')),
              
            ],
          ),
        )

       ),
    );


    
    }

}