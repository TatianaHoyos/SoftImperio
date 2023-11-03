package com.imperio.service.model.dto.login;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Authoritation {
    String token;
    @Builder.Default
    String type="Bearer";
    String refreshToken;
}
