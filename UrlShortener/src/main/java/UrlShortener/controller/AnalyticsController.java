package UrlShortener.controller;

import UrlShortener.dto.response.AnalyticsResponse;
import UrlShortener.model.User;
import UrlShortener.service.AnalyticsService;
import UrlShortener.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private UserService userService;

    @GetMapping("/{shortCode}")
    public ResponseEntity<?> getUrlAnalytics(@PathVariable String shortCode,
                                             @RequestParam(defaultValue = "30") int days,
                                             Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Authentication required");
                return ResponseEntity.status(401).body(errorResponse);
            }

            AnalyticsResponse analytics = analyticsService.getUrlAnalytics(shortCode, days);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", analytics);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getUserDashboard(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("error", "Authentication required");
                return ResponseEntity.status(401).body(errorResponse);
            }

            User user = getCurrentUser(authentication);
            AnalyticsResponse dashboard = analyticsService.getUserDashboard(user);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", dashboard);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
