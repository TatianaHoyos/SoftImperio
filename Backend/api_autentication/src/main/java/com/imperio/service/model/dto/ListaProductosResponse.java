package com.imperio.service.model.dto;

import com.imperio.service.model.entity.ProductoEntity;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
public class ListaProductosResponse {
    private List<ProductoResponce> productos;
}
