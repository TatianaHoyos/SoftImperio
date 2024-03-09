import 'package:flutter/material.dart';

class Loading extends StatelessWidget {

  const Loading({super.key});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.all(
                Radius.circular(10.0),
              ),
            ),
      content: Container(
              width: 250.0,
              height: 100.0,
              child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        CircularProgressIndicator(),
                        Padding(
                          padding: const EdgeInsets.only(left: 10.0),
                          child: Text(
                            "Cargando...",
                            style: TextStyle(
                              fontFamily: "OpenSans",
                              color: Color(0xFF5B6978),
                            ),
                          ),
                        )
                      ],
                    )
      )
    );
  }
}