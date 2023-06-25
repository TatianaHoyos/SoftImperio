package com.imperio.service.model.dto.usuarios;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RolRequest {
    private String   nombreRol;
    private String   estado;

}
