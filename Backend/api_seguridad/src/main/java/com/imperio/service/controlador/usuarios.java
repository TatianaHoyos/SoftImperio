package com.imperio.service.controlador;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class usuarios {
    private Connection connection;

    public usuarios() {
        // Configurar la conexión a la base de datos en este caso mysql no xampp
        String url = "jdbc:mysql://localhost:3306/soft_imperio";
        String username = "root";
        String password = "2002";

        try {
            connection = DriverManager.getConnection(url, username, password);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    //Metodo Create
    public void crearRegistro(int IdRol, String Nombre, String Documento, String Email,String Telefono,String Foto,String Password,String Estado ) {
        try {
            //  Aqui va la sentencia SQL para insertar un nuevo registro
            String sql = "INSERT INTO usuarios (IdRol,Nombre,Documento,Email,Telefono,Foto,Password,Estado) VALUES (?,?,?,?,?,?,?,?)";
            PreparedStatement statement = connection.prepareStatement(sql);
            //Aqui deben ir los atributos a insertar segun la tabla ya creada.
            statement.setInt(1, IdRol); //tener en cuenta el tipo de dato si es entero o texto
            statement.setString(2, Nombre); //tener en cuenta el tipo de dato si es entero o texto
            statement.setString(3, Documento); //tener en cuenta el tipo de dato si es entero o texto
            statement.setString(4, Email);
            statement.setString(5, Telefono);
            statement.setString(6, Foto);
            statement.setString(7, Password);
            statement.setString(8, Estado);

            // Ejecuta la sentencia SQL
            statement.executeUpdate();

            System.out.println("Registro creado con éxito."); //Mensaje de confirmación
        } catch (SQLException e) {
            e.printStackTrace(); //Mensaje de Error
        }
    }

    //Metodo Read
    public void obtenerRegistros() {
        try {
            //  Aqui va la sentencia SQL para obtener todos los registros
            String sql = "SELECT * FROM usuariocredito";
            PreparedStatement statement = connection.prepareStatement(sql);

            // Ejecuta la sentencia SQL
            ResultSet resultSet = statement.executeQuery();

            // El ciclo que itera sobre los resultados y los imprime
            while (resultSet.next()) {
                String Documento = resultSet.getString("Documento");
                String Nombre = resultSet.getString("Nombre");
                String Telefono = resultSet.getString("Telefono");
                //Mensaje con resultados 
                System.out.println("Documento: " + Documento + " Nombre: " + Nombre + " Telefono: " + Telefono);
            }
        } catch (SQLException e) {
            e.printStackTrace(); //Mensaje de Error
        }
    }
    //Metodo Update
    public void actualizarRegistro(String Documento, String Nombre, String Telefono) {
        try {
            //  Aqui va la sentencia SQL para actualizar un registro existente
            String sql = "UPDATE usuariocredito SET Documento = ?, Nombre = ?, Telefono = ? WHERE IdUsuarioCredito = ?";
            PreparedStatement statement = connection.prepareStatement(sql);
            //Aqui deben ir los atributos a insertar segun la tabla ya creada.
            statement.setString(1, Documento); //tener en cuenta el tipo de dato si es entero o texto
            statement.setString(2, Nombre); //tener en cuenta el tipo de dato si es entero o texto
            statement.setString(3, Telefono); //tener en cuenta el tipo de dato si es entero o texto

            // Ejecuta la sentencia SQL
            statement.executeUpdate();

            System.out.println("Registro actualizado con éxito."); //Mensaje de Confirmación
        } catch (SQLException e) {
            e.printStackTrace(); // Mensaje de Error
        }
    }
    //Metodo Delete
    public void eliminarRegistro(int IdUsuarioCredito) {
        try {
            // Aqui va la sentencia SQL para eliminar un registro existente
            String sql = "DELETE FROM usuariocredito WHERE IdUsuarioCredito= ?";
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setInt(1, IdUsuarioCredito);//Se elimina por el ID del Usuario

            // Ejecuta la sentencia SQL
            statement.executeUpdate();

            System.out.println("Registro eliminado con éxito."); //Mensaje de confirmación
        } catch (SQLException e) {
            e.printStackTrace(); //Mensaje de error
        }
    }
    //llamada  de metodos con paso de parametros
    public static void main(String[] args) {
        usuarios crud = new usuarios();

        // Ejemplos de uso
        crud.crearRegistro(1,"yeimar","2234455176","yeimarale@gmail.com","354782","image","23456","activo");
        // crud.obtenerRegistros();
        // crud.actualizarRegistro("66666666", "Gaymar Palacios", "3123232256");
        // crud.eliminarRegistro(7);
    }
}
