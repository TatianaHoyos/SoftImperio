package com.imperio.service.model.dto.oauth2;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Authoritation {
    String accessToken;
    @Builder.Default
    String tokenType ="Bearer";
    String refreshToken;
}
