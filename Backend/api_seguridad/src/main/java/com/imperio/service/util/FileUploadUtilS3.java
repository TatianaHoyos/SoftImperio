package com.imperio.service.util;


import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
public class FileUploadUtilS3 implements IFileUpload {


    private final AmazonS3 amazonS3Client;
    @Value("${aws.bucket.name}")
    private String bucketName;

    public FileUploadUtilS3(AmazonS3 amazonS3Client) {
        this.amazonS3Client = amazonS3Client;
    }

    public void saveFile(String folderName, String fileName, MultipartFile multipartFile) throws IOException {
        try {
            String s3Key = folderName.concat(fileName); // Construct the S3 key with the folder name

            // Obtener el tipo de contenido del archivo
            String contentType = multipartFile.getContentType();

            // Crear metadata y configurar el tipo de contenido
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(multipartFile.getSize());
            metadata.setContentType(contentType);
            amazonS3Client.putObject(new PutObjectRequest(bucketName,s3Key, multipartFile.getInputStream(), metadata));
        } catch (Exception e){
            log.error("save file s3", e);
            throw e;
        }
    }

    public void deleteFile(String filePath) {
        try {
            amazonS3Client.deleteObject(bucketName, filePath);
        } catch (Exception e){
            log.error("delete file s3", e);
            throw e;
        }
    }

    public void renameFile(String currentFileName, String newFileName) {
        try {
            amazonS3Client.copyObject(bucketName, currentFileName, bucketName, newFileName);
            amazonS3Client.deleteObject(bucketName, currentFileName);
        } catch (Exception e){
            log.error("rename file s3", e);
            throw e;
        }
    }
}

