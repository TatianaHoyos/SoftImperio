package com.imperio.service.model.dto.oauth2;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TokenRequest {
    @NotBlank
    private String accessToken;
    @NotBlank
    private String modulo;
    @NotBlank
    private String accion;

}
