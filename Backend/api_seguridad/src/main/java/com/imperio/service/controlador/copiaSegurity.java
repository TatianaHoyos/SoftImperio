package com.imperio.service.controlador;

import java.io.BufferedOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class copiaSegurity {
    public static void downloadBackup() {
            // Parámetros de conexión a la base de datos
            String user = "root";
            String password = "2002";
            String database = "soft_imperio";

            // Ruta donde se guardará el archivo de copia de seguridad
            String backupPath = "C:\\Users\\USUARIO\\Downloads\\copiasegurity\\backup.sql";

            // Comando para generar la copia de seguridad usando el comando mysqldump
            String dumpCommand = "\"C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump\" --user=" + user + " --password=" + password + " --databases " + database;


            try {
                // Ejecutar el comando mysqldump
                Process process = Runtime.getRuntime().exec(dumpCommand);

                // Crear un flujo de salida para escribir en el archivo de copia de seguridad
                BufferedOutputStream outputStream = new BufferedOutputStream(new FileOutputStream(backupPath));

                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = process.getInputStream().read(buffer)) != -1) {
                    // Escribir los datos en el archivo de copia de seguridad
                    outputStream.write(buffer, 0, bytesRead);
                }

                // Cerrar el flujo de salida
                outputStream.close();

                // Esperar a que el proceso termine y obtener el código de salida
                int exitCode = process.waitFor();

                // Verificar el código de salida para determinar si se generó correctamente la copia de seguridad
                if (exitCode == 0) {
                    System.out.println("Copia de seguridad generada correctamente.");
                } else {
                    System.out.println("Error al generar la copia de seguridad. Código de salida: " + exitCode);
                }
            } catch (IOException | InterruptedException e) {
                // Manejo de excepciones en caso de error
                e.printStackTrace();
            }
        }
}
