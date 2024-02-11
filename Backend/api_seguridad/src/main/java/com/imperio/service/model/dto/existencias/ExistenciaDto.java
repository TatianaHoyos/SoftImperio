package com.imperio.service.model.dto.existencias;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExistenciaDto {
    private Integer idExistencias;
    private Integer stock;
    private Integer cantidad;
    private String estado;
}
