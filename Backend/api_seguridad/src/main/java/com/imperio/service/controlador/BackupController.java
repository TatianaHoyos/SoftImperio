package com.imperio.service.controlador;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/backup")
public class BackupController {

    @GetMapping("/download")
    public String downloadBackup() {
        copiaSegurity.downloadBackup();
        return "Copia de seguridad generada correctamente.";
    }
}