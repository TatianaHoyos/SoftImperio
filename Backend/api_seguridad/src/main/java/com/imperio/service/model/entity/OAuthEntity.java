package com.imperio.service.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@Entity
@Table(name="oauth")
public class OAuthEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "IdOAuth")
    private Integer idOAuth;

    @OneToOne
    @JoinColumn(name = "IdUsuarios", referencedColumnName = "IdUsuarios")
    private UsuariosEntity usuariosEntity;

    @Column(nullable = false, unique = true,name = "token")
    private String token ;

    @Column(nullable = false, unique = true,name = "tokenRefresh")
    private String tokenRefresh ;

    @Column(nullable = false, name = "expiryDate")
    private Instant expiryDate ;

}
