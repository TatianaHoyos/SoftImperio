package com.imperio.apigateway.filter;

import com.imperio.apigateway.util.Constants;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import java.util.Arrays;
import java.util.Base64;
import java.util.stream.Collectors;


@Component
public class CustomHeaderFilter extends AbstractGatewayFilterFactory<CustomHeaderFilter.Config> {

    public CustomHeaderFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String encodedValue = generateEncodedValue(config, exchange);
            exchange.getRequest().mutate().header(config.getHeaderName(), encodedValue).build();
            return chain.filter(exchange);
        };
    }

    private String generateEncodedValue(Config config, ServerWebExchange exchange) {
        // Replace this with your custom logic to generate the Base64-encoded value
        // You can access other variables, expressions, or configuration values here
        String headerValue = config.getHeaderValue();
        return Constants.ENCODE_BASIC.concat(" "+ Base64.getEncoder().encodeToString(getCredential(headerValue).getBytes()));
    }

    private String getCredential(String credential) {
        return Arrays.stream(credential.split(Constants.ENCODE_BASIC))
                .map(String::trim)
                .collect(Collectors.joining());
    }
    public static class Config {
        private String headerName;
        private String headerValue;

        public String getHeaderName() {
            return headerName;
        }

        public void setHeaderName(String headerName) {
            this.headerName = headerName;
        }

        public String getHeaderValue() {
            return headerValue;
        }

        public void setHeaderValue(String headerValue) {
            this.headerValue = headerValue;
        }
    }
}


