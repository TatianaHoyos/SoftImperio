package com.imperio.service.model.dto.rol;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class ConfiguracionRequest {
    private int idRol;
    private List<Integer>permisos;
}
