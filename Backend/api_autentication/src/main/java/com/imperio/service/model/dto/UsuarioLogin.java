package com.imperio.service.model.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

@Data
@NoArgsConstructor
public class UsuarioLogin {
    private String correo;

    private String password;
}


