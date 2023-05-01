package com.imperio.service.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name="rol")
public class RolEntity {
    @Id
    @Column(name = "IdRol")
    private Integer idRol  ;

    @Column(nullable = false, name = "NombreRol")
    private String nombreRol;

    public String toString() {
        return "" +
                "idRol=" + idRol + '\n' +
                "nombreRol=" + nombreRol ;

    }

}
