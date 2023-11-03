package com.imperio.service.model.dto.login;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginResponse {
    private String nombre;
    private String documento;
    private String foto;
    private Integer rol;

    private Authoritation authoritation;
}
