package com.imperio.apigateway.service;

import com.imperio.apigateway.model.IntrospectUserResponse;
import com.imperio.apigateway.util.BussinessException;
import com.imperio.apigateway.util.Constants;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.Base64;
import java.util.stream.Collectors;


@Slf4j
@Service
public class AuthorizationByIntrospection implements IAuthorizationByIntrospection {
    @Value("${paths.auth.basePath}")
    private String baseUrl;
    @Value("${paths.auth.introspect}")
    private String pathIntrospect;
    private WebClient webClient;

    @Value("${security.clientId}")
    private String clientId;

    @Value("${security.clientSecret}")
    private String clientSecret;

    private String credencial;
    @PostConstruct
    public void init(){
        this.webClient = WebClient.builder().baseUrl(baseUrl).build();

        String plainCredentials = clientId.concat(":").concat(clientSecret);
        credencial = Base64.getEncoder().encodeToString(plainCredentials.getBytes());

    }
    @Override
    public Mono<IntrospectUserResponse> isValidTokenByIntrospection(ServerWebExchange exchange) {
        return getOauth2Introspect(exchange);
    }
    private Mono<IntrospectUserResponse> getOauth2Introspect(ServerWebExchange exchange) {
        try {
            return webClient
                    .post()
                    .uri(pathIntrospect)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .header(Constants.HTTP_AUTHORIZATION,"Basic " + credencial)
                    .body(BodyInserters
                    .fromFormData(Constants.BODY_TOKEN, getToken(exchange.getRequest())))
                    .exchange()
                    .flatMap(clientResponse -> {
                        if (clientResponse.statusCode().is2xxSuccessful()) {
                            return clientResponse.bodyToMono(IntrospectUserResponse.class)
                                    .flatMap(this::getTokenStatusValidation);
                        } else {
                            return clientResponse.bodyToMono(String.class)
                                    .flatMap(this::processIntrospectUserError);
                        }
                    }).onErrorResume(Mono::error);
        } catch (Exception exception) {
            log.error("Error procesando el llamado a instrospect: ", exception);
            return Mono.error(new BussinessException(Constants.MSG_ERROR_GENERIC));
        }
    }
    private Mono<IntrospectUserResponse> getTokenStatusValidation(IntrospectUserResponse response) {
        if (response.getStatus().equals("exito")) {
            return Mono.just(response);
        }

        log.error("El token no está activo");
        return Mono.error(new BussinessException(Constants.MSG_ERROR_TOKEN_INVALID));
    }

    private Mono<IntrospectUserResponse> processIntrospectUserError(String responseError) {
        log.error("Error en la respuesta del servicio de introspect: {}", responseError);
        return Mono.error(new BussinessException(Constants.MSG_ERROR_TOKEN_INVALID));
    }

    private String getToken(ServerHttpRequest request) {
        String authorization = getAuthHeader(request);
        return Arrays.stream(authorization.split(Constants.ENCODE_BEARER))
                .map(String::trim)
                .collect(Collectors.joining());
    }

    private String getAuthHeader(ServerHttpRequest request) {
        return request.getHeaders().getOrEmpty("authorization").get(0);
    }


}
