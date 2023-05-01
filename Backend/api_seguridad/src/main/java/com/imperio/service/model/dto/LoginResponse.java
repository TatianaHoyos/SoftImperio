package com.imperio.service.model.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginResponse {
    private String nombre;
    private String documento;
    private Integer rol;
}
