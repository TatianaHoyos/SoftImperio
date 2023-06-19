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

    public void crearRegistro(String Documento, String Nombre, String Telefono) {
        try {
            // Prepara la sentencia SQL para insertar un nuevo registro
            String sql = "INSERT INTO usuariocredito (Documento, Nombre, Telefono) VALUES (?, ?, ?)";
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setString(1, Documento);
            statement.setString(2, Nombre);
            statement.setString(3, Telefono);

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

                System.out.println("Documento: " + Documento + " Nombre: " + Nombre + " Telefono: " + Telefono);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void actualizarRegistro(String Documento, String Nombre, String Telefono) {
        try {
            // Prepara la sentencia SQL para actualizar un registro existente
            String sql = "UPDATE usuariocredito SET Documento = ?, Nombre = ?, Telefono = ? WHERE IdUsuarioCredito = ?";
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setString(1, Documento);
            statement.setString(2, Nombre);
            statement.setString(3, Telefono);

            // Ejecuta la sentencia SQL
            statement.executeUpdate();

            System.out.println("Registro actualizado con éxito.");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void eliminarRegistro(int IdUsuarioCredito) {
        try {
            // Prepara la sentencia SQL para eliminar un registro existente
            String sql = "DELETE FROM usuariocredito WHERE IdUsuarioCredito= ?";
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setInt(1, IdUsuarioCredito);

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
        // crud.crearRegistro("52568987", "Andrey Guzman", "3125468974");
        // crud.obtenerRegistros();
        // crud.actualizarRegistro("66666666", "Gaymar Palacios", "3123232256");
        // crud.eliminarRegistro(7);
    }
}
