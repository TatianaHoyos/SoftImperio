package com.imperio.service.util;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;


public class FileUploadUtil implements IFileUpload {

    public void saveFile(String uploadDir, String fileName,
                                MultipartFile multipartFile) throws IOException {
        Path uploadPath = Paths.get(uploadDir);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        try (InputStream inputStream = multipartFile.getInputStream()) {
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ioe) {
            throw new IOException("No se pudo guardar la imagen: " + fileName, ioe);
        }
    }

    public void deleteFile(String filePath) throws IOException {
        Path path = Paths.get(filePath);
        Files.deleteIfExists(path);
    }

    public void renameFile(String currentFilePath, String newFileName) throws IOException {
        Path currentPath = Paths.get(currentFilePath);
        Path newPath = currentPath.resolveSibling(newFileName);

        Files.move(currentPath, newPath, StandardCopyOption.REPLACE_EXISTING);
    }
}
