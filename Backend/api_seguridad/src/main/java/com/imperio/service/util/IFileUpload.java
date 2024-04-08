package com.imperio.service.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface IFileUpload {

    void saveFile(String folderName, String fileName, MultipartFile multipartFile) throws IOException;

    void deleteFile(String filePath) throws IOException;

    void renameFile(String currentFilePath, String newFileName) throws IOException;

}
