package com.imperio.service.controlador;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class usuariocredito {
    private Connection connection;

    public usuariocredito() {
        // Configurar la conexión a la base de datos en este caso mysql no xampp
        String url = "jdbc:mysql://localhost:3306/soft_imperiof";
        String username = "root";
        String password = "Sena1234";

        try {
            connection = DriverManager.getConnection(url, username, password);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    //Metodo Create
    public void crearRegistro(String Documento, String Nombre, String Telefono) {
        try {
            //  Aqui va la sentencia SQL para insertar un nuevo registro
            String sql = "INSERT INTO usuariocredito (Documento, Nombre, Telefono) VALUES (?, ?, ?)";
            PreparedStatement statement = connection.prepareStatement(sql);
            //Aqui deben ir los atributos a insertar segun la tabla ya creada.
            statement.setString(1, Documento); //tener en cuenta el tipo de dato si es entero o texto
            statement.setString(2, Nombre); //tener en cuenta el tipo de dato si es entero o texto
            statement.setString(3, Telefono); //tener en cuenta el tipo de dato si es entero o texto

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
        usuariocredito crud = new usuariocredito();

        // Ejemplos de uso
        // crud.crearRegistro("52568987", "Andrey Guzman", "3125468974");
        // crud.obtenerRegistros();
        // crud.actualizarRegistro("66666666", "Gaymar Palacios", "3123232256");
        // crud.eliminarRegistro(7);
    }
}














