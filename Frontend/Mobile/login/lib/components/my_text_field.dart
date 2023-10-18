import 'package:flutter/material.dart';

class MyTextField extends StatelessWidget {
  final controller;
  final String hintText;
  final bool secureText;
  final String? errorText;
  final Icon? prefixIcon;
  final TextInputType? keyboardType;
  final bool? enable;

  const MyTextField({
    super.key,
    required this.controller,
    required this.hintText,
    required this.secureText,
    this.errorText,
    this.prefixIcon,
    this.keyboardType,
    this.enable,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 25.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextField(
            controller: controller,
            enabled: enable,
            keyboardType: keyboardType,
            obscureText: secureText,
            style: TextStyle(color: Colors.white),
            decoration: InputDecoration(
              prefixIcon:prefixIcon ,
              errorText: errorText,
              disabledBorder: const OutlineInputBorder(
                borderSide: BorderSide(color: Colors.white)
              ),
              errorBorder: const OutlineInputBorder(
                borderSide: BorderSide(color: Colors.red)
              ),
              focusedErrorBorder: const OutlineInputBorder(
                borderSide: BorderSide(color: Colors.red)
              ),
              enabledBorder: const OutlineInputBorder(
                borderSide: BorderSide(color: Colors.white)
              ),
              focusedBorder: OutlineInputBorder(
                borderSide: BorderSide(color: Colors.grey.shade400)
              ),
              fillColor: Colors.transparent,
              filled: true,
              hintText: hintText,
              hintStyle: TextStyle(
                color: Colors.grey[500]
              )
              ),
          ),
           if (errorText != null && enable == null && enable != null)
            Padding(
              padding: const EdgeInsets.only(left: 12.0, top: 0.0),
              child: Text(
                errorText!,
                style: TextStyle(color: Colors.red, fontSize: 12),
              ),
            ),
        ],
      ),
    );
  }
}