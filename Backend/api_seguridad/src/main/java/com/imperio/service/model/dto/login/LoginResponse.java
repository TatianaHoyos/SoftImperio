package com.imperio.service.model.dto.login;

import com.imperio.service.model.dto.oauth2.Authoritation;
import com.imperio.service.model.dto.rol.RolResponse;
import com.imperio.service.model.entity.RolEntity;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginResponse {
    private String nombre;
    private String documento;
    private String foto;
    private RolEntity rol;

    private Authoritation authoritation;
}
