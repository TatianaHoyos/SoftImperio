package com.imperio.service.model.dto;

import com.imperio.service.model.entity.CategoriaEntity;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class CategoriaResponse {
    private  List<CategoriaEntity> categorias;
}
