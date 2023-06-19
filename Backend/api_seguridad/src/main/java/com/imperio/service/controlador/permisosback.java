package com.imperio.service.controlador;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class permisosback {
    private Connection connection;

    public permisosback() {
        // Configura la conexión a la base de datos
        String url = "jdbc:mysql://localhost:3306/soft_imperiof";
        String username = "root";
        String password = "Sena1234";

        try {
            connection = DriverManager.getConnection(url, username, password);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void crearRegistro(int Documento, String Nombre, int Telefono) {
        try {
            // Prepara la sentencia SQL para insertar un nuevo registro
            String sql = "INSERT INTO usuariocredito (Documento, Nombre, telefono) VALUES (?, ?, ?)";
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setInt(1, Documento); //El valor del Documento
            statement.setString(2, Nombre); //El valor del Nombre
            statement.setInt(3, Telefono); //El valor del Teléfono


            // Ejecuta la sentencia SQL
            statement.executeUpdate();

            System.out.println("Registro creado con éxito.");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void obtenerRegistros() {
        try {
            // Prepara la sentencia SQL para obtener todos los registros
            String sql = "SELECT * FROM usuariocredito";
            PreparedStatement statement = connection.prepareStatement(sql);

            // Ejecuta la sentencia SQL
            ResultSet resultSet = statement.executeQuery();

            // Itera sobre los resultados y los imprime
            while (resultSet.next()) {
                String Documento = resultSet.getString("Documento");
                String Nombre = resultSet.getString("Nombre");
                String Telefono = resultSet.getString("Telefono");


                System.out.println("Documento: "+ Documento + "Nombre: " + Nombre + ", Telefono: " + Telefono);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void actualizarRegistro(int Documento, String Nombre, int Telefono) {
        try {
            // Prepara la sentencia SQL para actualizar un registro existente
            String sql = "UPDATE usuariocredito SET Documento = ?, Nombre = ?, Telefono = ? WHERE idUsuarioCredito = 5";
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setInt(1, Documento);
            statement.setString(2, Nombre);
            statement.setInt(3, Telefono);

            // Ejecuta la sentencia SQL
            statement.executeUpdate();

            System.out.println("Registro actualizado con éxito.");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void eliminarRegistro(int idUsuarioCredito) {
        try {
            // Prepara la sentencia SQL para eliminar un registro existente
            String sql = "DELETE FROM usuariocredito WHERE idUsuarioCredito = ?";
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setInt(1, idUsuarioCredito);

            // Ejecuta la sentencia SQL
            statement.executeUpdate();

            System.out.println("Registro eliminado con éxito.");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        permisosback crud = new permisosback();

        // Ejemplos de uso
        // crud.crearRegistro(1111111, "aaaaa", 55555);
        // crud.obtenerRegistros();
        // crud.actualizarRegistro(123456789, "Felipe", 2525252);
        // crud.eliminarRegistro(5);
    }
}
