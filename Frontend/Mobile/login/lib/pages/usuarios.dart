import 'package:flutter/material.dart';
import 'package:flutter_slidable/flutter_slidable.dart';
import 'package:login/components/my_button.dart';
import 'package:login/components/my_text_field.dart';
import 'package:login/model/usuario.dart';
import 'package:login/pages/formulario_usuarios.dart';

class Usuarios extends StatefulWidget {
  const Usuarios({super.key});

  @override
  State<Usuarios> createState() => _CampoTextoState();
}

enum Actions{delete,edit}

class _CampoTextoState extends State<Usuarios> {
   final searchController = TextEditingController();
   final List<Usuario> usuarios = listaUsuarios;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children:<Widget> [
            const SizedBox(height: 25),
            Text(
                 'Nuestros Usuarios',
                 style: TextStyle(color: const Color.fromARGB(255, 255, 239, 239),
                  fontSize: 20,
                  fontWeight: FontWeight.bold ),
               ),
               const SizedBox(height: 25),
            MyTextField(
                controller: searchController,
                hintText: 'Buscar',
                secureText: false,
                prefixIcon: Icon(Icons.search),
              ),
               const SizedBox(height: 25),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 150,
                    child: MyButton(onPressed: (){
                      Navigator.push(context,
                      MaterialPageRoute(builder: (context) => const Formulario(title: 'Form',)));
                    }, text: 'Agregar'),
                  ),
                     SizedBox(
                    width: 150,
                    child: MyButton(onPressed: (){}, text: 'Reporte'),
                    
                  ),
                ],
              ),
              const SizedBox(height: 25),
             Expanded(child:  ListView.builder(
                  itemCount: usuarios.length+1,
                  physics: const BouncingScrollPhysics(),
                  itemBuilder: (context, index) {
                    if(index==0){
                      return buildHeaderList();
                    }
                    index-=1;
                    final user = usuarios[index];
                    return Slidable(
                      startActionPane: ActionPane(
                        motion: const StretchMotion(),
                        children: [SlidableAction(backgroundColor: Colors.lightBlueAccent,
                        icon:Icons.edit ,
                        label: 'Editar',
                        onPressed: (context) => onEditarUsuario(context),)],
                      ),
                      endActionPane: ActionPane(motion: const BehindMotion(),
                       children:[SlidableAction(backgroundColor: Colors.redAccent,
                        icon:Icons.delete ,
                        label: 'Eliminar',
                        onPressed: (context) => onEliminarUsuario(context, index),)] ),
                      child: buildItemList(user),
                    );
                  }),
             )
          ],   
        ),   
      ),
    );
     
  }

  Widget buildItemList(Usuario usuario) => Container(
    decoration: BoxDecoration(
      border: Border(bottom: BorderSide(
        color: Colors.grey.shade400
      ))
    ),
    child: Padding(
      padding:const EdgeInsets.all(16),
      child: Row(
        children: [
          Expanded(child: Text(usuario.nombre)),
          Expanded(child: Text(usuario.documento)),
          Expanded(child: Text(usuario.correo)),
          Expanded(child: Text(usuario.telefono))
        ],
      ),
      ),
  );
      Widget buildHeaderList() => Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(5),
          color: Color(0xffe9b689),
          border: Border.all(
            color: Colors.transparent,
            width: 1,
            style: BorderStyle.solid
          )
        ),
          //color: Color(0xffe9b689),
          child: const Padding(
            padding:EdgeInsets.all(16),
            child: Row(
          children: [
            Expanded(child: Text('nombre')),
            Expanded(child: Text('documento')),
            Expanded(child: Text('correo')),
            Expanded(child: Text('telefono'))
          ],
            ),
            ),
      );

      void onEditarUsuario(BuildContext context){
         Navigator.push(context,
                      MaterialPageRoute(builder: (context) => const Formulario(title: 'Form',)));
      }

      
      void onEliminarUsuario(BuildContext context, int index){
        Widget cancelButton(BuildContext context) => TextButton(
          child: Text("Cancel"),
          onPressed:  () => Navigator.pop(context, false),
        );
      Widget continueButton(BuildContext context) => TextButton(
        child: Text("Continue"),
        onPressed:  () {
          Navigator.pop(context, false);
          final  usuario=  usuarios[index];
          setState(() {
            usuarios.removeAt(index);
          });
        },
      );

  // set up the AlertDialog
  AlertDialog alert(BuildContext context) => AlertDialog(
    title: Text("Eliminar Usuario"),
    content: Text("Seguro de eliminar este usuario?"),
    actions: [
      cancelButton(context),
      continueButton(context),
    ],
  );

  // show the dialog
  showDialog(
    context: context,
    barrierDismissible: true,
    builder: (BuildContext context) {
      return alert(context);
    },
  );
  
      }
  
}