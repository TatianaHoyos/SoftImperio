using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.IO;

namespace venta.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BackupController : ControllerBase
    {
        [HttpGet("backup/sql")]
        public IActionResult DownloadBackupSQL()
        {
            // Ruta para guardar el archivo de respaldo
            string backupFilePath = @"C:\Users\Daniel\Documents\dumps\backup.sql"; // Cambiar a la ruta deseada

            // Generar el respaldo de la base de datos en tiempo real utilizando mysqldump
            using (Process process = new Process())
            {
                process.StartInfo.FileName = "mysqldump";
                process.StartInfo.Arguments = $"-u root -pSena1234 softimperio"; // Reemplazar con tus credenciales y nombre de base de datos
                process.StartInfo.RedirectStandardInput = false;
                process.StartInfo.RedirectStandardOutput = true;
                process.StartInfo.UseShellExecute = false;

                using (StreamWriter writer = new StreamWriter(backupFilePath))
                {
                    process.Start();

                    // Leer la salida estándar de mysqldump y escribirla en el archivo de respaldo
                    using (StreamReader reader = process.StandardOutput)
                    {
                        while (!reader.EndOfStream)
                        {
                            string line = reader.ReadLine();
                            writer.WriteLine(line); // Escribir en el StreamWriter, no directamente en el FileStream
                        }
                    }

                    process.WaitForExit();
                }
            }


            // Verificar si se generó correctamente el archivo de respaldo
            if (System.IO.File.Exists(backupFilePath))
            {
                // Leer el contenido del archivo de respaldo
                byte[] fileContents = System.IO.File.ReadAllBytes(backupFilePath);

                // Establecer el encabezado Content-Disposition para sugerir un nombre de archivo
                var contentDisposition = new System.Net.Mime.ContentDisposition
                {
                    FileName = "backup.sql",
                    Inline = false, // Indica que el archivo debe ser descargado
                };

                Response.Headers.Add("Content-Disposition", contentDisposition.ToString());

                // Devolver el archivo SQL como un FileResult
                return File(fileContents, "application/octet-stream"); // Se especifica como application/octet-stream para indicar que es un archivo binario
            }
            else
            {
                // Si el archivo de respaldo no se generó correctamente, devolver un error 500
                return StatusCode(500, "Error al generar el archivo de respaldo.");
            }
        }
    }
}
