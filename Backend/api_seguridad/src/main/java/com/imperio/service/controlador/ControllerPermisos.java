package com.imperio.service.controlador;

import com.imperio.service.repository.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class ControllerPermisos {
    @Autowired
    private RolService rolService;

    @GetMapping(value = "api/roles", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> obtenerRoles(){
        return ResponseEntity.ok(rolService.obtenerRoles());
    }
}
