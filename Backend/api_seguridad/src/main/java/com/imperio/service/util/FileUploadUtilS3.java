package com.imperio.service.util;


import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@Service
public class S3FileUploadUtil {

    @Autowired
    private AmazonS3 amazonS3Client;
    @Value("${aws.bucket.name}")
    private String bucketName;

    public String saveFile(String folderName, String fileName, MultipartFile multipartFile) throws IOException {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(multipartFile.getSize());
        amazonS3Client.putObject(new PutObjectRequest(bucketName + "/" + folderName, fileName, multipartFile.getInputStream(), metadata));
        return fileName;
    }

    public void deleteFile(String folderName, String fileName) {
        amazonS3Client.deleteObject(bucketName + "/" + folderName, fileName);
    }

    public void renameFile(String folderName, String currentFileName, String newFileName) {
        amazonS3Client.copyObject(bucketName + "/" + folderName, currentFileName, bucketName + "/" + folderName, newFileName);
        amazonS3Client.deleteObject(bucketName + "/" + folderName, currentFileName);
    }

    public byte[] getFile(String folderName, String fileName) throws IOException {
        S3Object s3Object = amazonS3Client.getObject(bucketName + "/" + folderName, fileName);
        S3ObjectInputStream inputStream = s3Object.getObjectContent();
        return inputStream.readAllBytes();
    }

}

