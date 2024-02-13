package com.imperio.service.oauth2.jwt;

import com.imperio.service.model.entity.OAuthEntity;
import com.imperio.service.model.entity.UsuariosEntity;
import com.imperio.service.repository.OAuthService;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;
import java.util.function.Function;

@Slf4j
@Service
public class JwtService implements IJwtService{


    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration.ms}")
    private int jwtExpirationMs;

    @Autowired
    private OAuthService oAuthService;

    @Override
    public Map<String,Object> extraerDatosUsuarios(String token) {
        // Obtén los claims adicionales
        return new HashMap<>(extractClaim(token));
    }



    @Override
    public String generarToken(UsuariosEntity user) {
        return generateToken(user);
    }

    @Override
    public boolean isTokenValido(String token,UsuariosEntity user) {
        final String userName = extractClaim(token, Claims::getSubject);
        return (userName.equals(user.getNombre())) && !isTokenExpired(token);
    }

    @Override
    public boolean isTokenValido(String token) {
        final String userName = extractClaim(token, Claims::getSubject);
        return (userName != null && !isTokenExpired(token));

    }

    @Override
    public Optional<OAuthEntity> encontrarToken(String token) {
        return oAuthService.encontrarToken(token);
    }
    @Transactional
    @Override
    public void eliminarToken(OAuthEntity oAuth) {
        oAuthService.eliminarToken(oAuth);
    }

    private String generateToken(UsuariosEntity user) {
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("Rol", user.getRol().getNombreRol());
        extraClaims.put("IdRol", user.getRol().getIdRol());
        return Jwts.builder()
                .claims(extraClaims)
                .subject(user.getNombre())
                .issuedAt((new Date(System.currentTimeMillis())))
                .expiration(new Date(new Date().getTime() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(string256(jwtSecret));
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public static String string256(String str) {
        // Convertimos el string a bytes
        byte[] bytes = str.getBytes(StandardCharsets.UTF_8);

        // Generamos un hash SHA-256 de los bytes
        MessageDigest md = null;
        try {
            md = MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            log.error("error creando llave",e);
        }
        byte[] hash = md.digest(bytes);

        // Convertimos el hash a un string de 256 bits
        String encodedHash = Base64.getEncoder().encodeToString(hash);

        return encodedHash;
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolvers) {
        final Claims claims = extractAllClaims(token);
        return claimsResolvers.apply(claims);
    }

    private Claims extractClaim(String token) {
        final Claims claims = extractAllClaims(token);
        return claims;
    }


    private Claims extractAllClaims(String token) {
        try {
        return Jwts.parser().setSigningKey(getSigningKey()).build().parseClaimsJws(token)
                .getBody();
    } catch (SignatureException e) {
        log.error("Invalid JWT signature: {}", e.getMessage());
    } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
    } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
    } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
    } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
    }
        return null;

}

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}

