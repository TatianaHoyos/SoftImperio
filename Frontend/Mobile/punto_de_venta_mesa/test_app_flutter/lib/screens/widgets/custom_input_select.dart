
import 'package:flutter/material.dart';

class CustomInputSelect extends StatefulWidget {
  final List<String> categoryItems;

  const CustomInputSelect({
    Key? key,
    required this.categoryItems,
  }) : super(key: key);

  @override
  _CustomInputSelectState createState() => _CustomInputSelectState();
}

class _CustomInputSelectState extends State<CustomInputSelect> {
  String selectedItem = '330';

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(8.0),
      child: DropdownButton<String>(
        value: selectedItem,
        onChanged: (String? newValue) {
          setState(() {
            selectedItem = newValue!;
          });
        },
        items: widget.categoryItems
            .map<DropdownMenuItem<String>>((String value) {
          return DropdownMenuItem<String>(
            value: value,
            child: Text(
              value,
              style: const TextStyle(
                color: Colors.white,
              ),
            ),
          );
        })
            .toList(),
        style: const TextStyle(
          color: Colors.white,
        ),
        dropdownColor: Colors.black87,
      ),
    );
  }
}
