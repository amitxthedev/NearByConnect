package com.nearbyconnect.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class RecaptchaService {

    private static final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    @Value("${app.recaptcha.secret-key:}")
    private String secretKey;

    @Value("${app.recaptcha.score:0.5}")
    private double minScore;

    public boolean verify(String token) {
        if (secretKey == null || secretKey.isBlank()) {
            log.warn("reCAPTCHA secret key not configured — skipping verification");
            return true;
        }

        if (token == null || token.isBlank()) {
            log.warn("reCAPTCHA token is empty");
            return false;
        }

        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("secret", secretKey);
            body.add("response", token);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(VERIFY_URL, request, Map.class);

            if (response.getBody() == null) {
                return false;
            }

            boolean success = Boolean.TRUE.equals(response.getBody().get("success"));
            double score = response.getBody().get("score") != null
                    ? ((Number) response.getBody().get("score")).doubleValue()
                    : 1.0;
            String hostname = (String) response.getBody().get("hostname");

            log.info("reCAPTCHA verify: success={}, score={}, hostname={}", success, score, hostname);

            return success && score >= minScore;
        } catch (Exception e) {
            log.error("reCAPTCHA verification failed: {}", e.getMessage());
            return false;
        }
    }
}
