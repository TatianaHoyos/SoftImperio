import 'package:flutter/material.dart';
/*
class DropdownController<T> {
  final ValueNotifier<T> selectedValue;

  DropdownController(T initialValue) : selectedValue = ValueNotifier(initialValue);

  void dispose() {
    selectedValue.dispose();
  }
}
*/
class MyDropDown extends StatefulWidget {
  final List<String> items;
  final String hintText;
  final String? errorText;
  final Icon? prefixIcon;
  final ValueChanged<String> onChanged;

  

  const MyDropDown({
    super.key,
    required this.items,
    required this.hintText,
    required this.onChanged,
    this.errorText,
    this.prefixIcon
  });

  @override
  State<MyDropDown> createState() => _MyDropDownState();
}

class _MyDropDownState extends State<MyDropDown> {
  String? _selectedValue;

  @override
  Widget build(BuildContext context) {
    return  Padding(
  padding: const EdgeInsets.symmetric(horizontal: 25.0),
  child: DecoratedBox(
    decoration: const BoxDecoration(
      color: Colors.transparent,
     // filled: true,
    ),
    child: DropdownButtonFormField(
      value: _selectedValue,
      icon: const Icon(Icons.arrow_drop_down_circle_outlined),
      items: widget.items.map((item) {
        return DropdownMenuItem(
          child: Text(item),
          value: item,
        );
      }).toList(),
      onChanged: (value) {
        setState(() {
          _selectedValue = value;
          widget.onChanged(value!);
        });
      },
      style: TextStyle(color: Colors.white),
      decoration: InputDecoration(
        prefixIcon:widget.prefixIcon ,
        errorText: widget.errorText,
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
        hintText: widget.hintText,
        hintStyle: TextStyle(
          color: Colors.grey[500]
        )
      ),
    ),
  ),
);
  }
}