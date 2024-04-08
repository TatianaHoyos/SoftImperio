package com.imperio.service.config;

import com.amazonaws.services.s3.AmazonS3;
import com.imperio.service.util.FileUploadUtil;
import com.imperio.service.util.FileUploadUtilS3;
import com.imperio.service.util.IFileUpload;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class FileUploadConfig {

    @Profile("local")
    @Bean
    public IFileUpload fileUpload(){
        return new FileUploadUtil();
    }

    @Profile("!local")
    @Bean
    public IFileUpload fileUploadS3(AmazonS3 amazonS3Client){
        return new FileUploadUtilS3(amazonS3Client);
    }
}
