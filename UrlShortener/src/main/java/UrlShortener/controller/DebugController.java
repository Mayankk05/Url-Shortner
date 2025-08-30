package UrlShortener.controller;

import UrlShortener.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/debug")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DebugController {

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/test-jwt")
    public ResponseEntity<?> testJwt() {
        try {
            // Generate a test token
            String testToken = jwtUtil.generateToken("test@example.com");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", testToken);
            response.put("tokenParts", testToken.split("\\.").length);
            response.put("isValid", jwtUtil.validateToken(testToken));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/validate-jwt")
    public ResponseEntity<?> validateJwt(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", token);
            response.put("tokenParts", token.split("\\.").length);
            response.put("isValid", jwtUtil.validateToken(token));

            if (jwtUtil.validateToken(token)) {
                response.put("email", jwtUtil.getEmailFromToken(token));
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/test-auth")
    public ResponseEntity<?> testAuth() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Debug endpoint is working!");
        response.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }
}