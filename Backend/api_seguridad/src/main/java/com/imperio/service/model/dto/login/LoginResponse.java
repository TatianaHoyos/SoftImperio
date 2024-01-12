package com.imperio.service.model.dto.login;

import com.imperio.service.model.dto.oauth2.Authoritation;
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
