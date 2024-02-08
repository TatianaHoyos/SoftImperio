package com.imperio.apigateway.service;

import com.imperio.apigateway.model.IntrospectUserResponse;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

public interface IAuthorizationByIntrospection {
    Mono<IntrospectUserResponse> isValidTokenByIntrospection(ServerWebExchange exchange);

}
