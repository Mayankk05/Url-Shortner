package UrlShortener.controller;

import UrlShortener.model.Url;
import UrlShortener.service.AnalyticsService;
import UrlShortener.service.UrlService;
import UrlShortener.repository.UrlRepository;
import UrlShortener.repository.ClickEventRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class RedirectController {

    @Autowired
    private UrlService urlService;

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private UrlRepository urlRepository;

    @Autowired
    private ClickEventRepository clickEventRepository;

    // Main redirect endpoint for short URLs
    @GetMapping("/{shortCode}")
    public ResponseEntity<?> redirectToOriginalUrl(@PathVariable String shortCode,
                                                   HttpServletRequest request) {
        System.out.println("=== REDIRECT DEBUG ===");
        System.out.println("Received short code: '" + shortCode + "'");
        System.out.println("Request URL: " + request.getRequestURL());
        System.out.println("Request Method: " + request.getMethod());

        try {
            // Validate short code format
            if (shortCode == null || shortCode.trim().isEmpty()) {
                System.out.println("Short code is null or empty");
                return ResponseEntity.notFound().build();
            }

            // Basic length validation
            if (shortCode.length() < 6 || shortCode.length() > 8) {
                System.out.println("Short code length invalid: " + shortCode.length());
                return ResponseEntity.notFound().build();
            }

            // Skip system paths
            if (isSystemPath(shortCode)) {
                System.out.println("System path detected, skipping: " + shortCode);
                return ResponseEntity.notFound().build();
            }

            System.out.println("Finding URL for short code: " + shortCode);
            Url url = urlService.findByShortCode(shortCode);

            System.out.println("URL found:");
            System.out.println("  - Original URL: " + url.getOriginalUrl());
            System.out.println("  - Is Active: " + url.getIsActive());
            System.out.println("  - Expires At: " + url.getExpiresAt());
            System.out.println("  - Current Click Count: " + url.getClickCount());

            // Check if URL is active
            if (!url.getIsActive()) {
                System.out.println("URL is not active - returning 404");
                return ResponseEntity.notFound().build();
            }

            // Check if URL is expired
            if (url.isExpired()) {
                System.out.println("URL is expired - returning 410");
                return ResponseEntity.status(HttpStatus.GONE).build();
            }

            // Get client information for analytics
            String ipAddress = getClientIpAddress(request);
            String userAgent = request.getHeader("User-Agent");
            String referrer = request.getHeader("Referer");

            System.out.println("Client Information:");
            System.out.println("  - IP Address: " + ipAddress);
            System.out.println("  - User Agent: " + (userAgent != null ? userAgent.substring(0, Math.min(userAgent.length(), 50)) + "..." : "null"));
            System.out.println("  - Referrer: " + referrer);

            String originalUrl = url.getOriginalUrl();

            // Record analytics event
            try {
                System.out.println("Recording click event...");
                analyticsService.recordClickEvent(url, ipAddress, userAgent, referrer);
                System.out.println("Click event recorded successfully");
            } catch (Exception e) {
                System.err.println("Failed to record click event: " + e.getMessage());
                e.printStackTrace();
                // Continue with redirect even if analytics fails
            }

            // Update click count
            try {
                System.out.println("Incrementing click count...");
                urlService.incrementClickCount(url);
                System.out.println("Click count incremented successfully");
            } catch (Exception e) {
                System.err.println("Failed to increment click count: " + e.getMessage());
                e.printStackTrace();
                // Continue with redirect even if count update fails
            }

            System.out.println("Redirecting to: " + originalUrl);

            // Perform the redirect
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(originalUrl))
                    .build();

        } catch (Exception e) {
            System.err.println("Exception in redirect:");
            System.err.println("  - Type: " + e.getClass().getSimpleName());
            System.err.println("  - Message: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.notFound().build();
        }
    }

    // Preview endpoint - shows where the URL will redirect without actually redirecting
    @GetMapping("/preview/{shortCode}")
    public ResponseEntity<?> previewUrl(@PathVariable String shortCode) {
        try {
            if (shortCode == null || shortCode.trim().isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Url url = urlService.findByShortCode(shortCode);

            Map<String, Object> previewData = new HashMap<>();
            previewData.put("shortCode", shortCode);
            previewData.put("originalUrl", url.getOriginalUrl());
            previewData.put("title", url.getTitle());
            previewData.put("description", url.getDescription());
            previewData.put("clickCount", url.getClickCount());
            previewData.put("isActive", url.getIsActive());
            previewData.put("createdAt", url.getCreatedAt());
            previewData.put("expiresAt", url.getExpiresAt());
            previewData.put("isExpired", url.isExpired());

            return ResponseEntity.ok(previewData);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Short URL not found or has expired");
            errorResponse.put("shortCode", shortCode);

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    // Debug endpoint - shows all URLs in database
    @GetMapping("/debug/urls")
    public ResponseEntity<?> debugUrls() {
        try {
            List<Url> allUrls = urlRepository.findAll();

            if (allUrls.isEmpty()) {
                return ResponseEntity.ok("No URLs found in database");
            }

            List<Map<String, Object>> urlInfo = allUrls.stream()
                    .map(url -> {
                        Map<String, Object> info = new HashMap<>();
                        info.put("shortCode", url.getShortCode());
                        info.put("originalUrl", url.getOriginalUrl());
                        info.put("title", url.getTitle());
                        info.put("clickCount", url.getClickCount());
                        info.put("isActive", url.getIsActive());
                        info.put("createdAt", url.getCreatedAt());
                        info.put("expiresAt", url.getExpiresAt());
                        return info;
                    })
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("totalUrls", allUrls.size());
            response.put("urls", urlInfo);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    // Debug endpoint - check click events for a specific URL
    @GetMapping("/debug/clicks/{shortCode}")
    public ResponseEntity<?> debugClickEvents(@PathVariable String shortCode) {
        try {
            Url url = urlService.findByShortCode(shortCode);
            long clickEventCount = clickEventRepository.countByUrl(url);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("shortCode", shortCode);
            response.put("urlClickCount", url.getClickCount());
            response.put("clickEventsInDB", clickEventCount);
            response.put("lastUpdated", url.getUpdatedAt());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    // Debug endpoint - manually create a click event for testing
    @PostMapping("/debug/test-click/{shortCode}")
    public ResponseEntity<?> createTestClick(@PathVariable String shortCode) {
        try {
            Url url = urlService.findByShortCode(shortCode);

            // Record a test click event
            analyticsService.recordClickEvent(url, "127.0.0.1", "Test-User-Agent/1.0", "http://test.com");

            // Increment click count
            urlService.incrementClickCount(url);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Test click event created for " + shortCode);
            response.put("newClickCount", url.getClickCount() + 1);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    // Helper method to check if a path is a system path (to avoid conflicts)
    private boolean isSystemPath(String path) {
        return path.equals("api") ||
                path.equals("health") ||
                path.equals("actuator") ||
                path.equals("error") ||
                path.equals("favicon.ico") ||
                path.equals("static") ||
                path.equals("css") ||
                path.equals("js") ||
                path.equals("images") ||
                path.equals("debug") ||
                path.equals("preview");
    }

    // Helper method to get the real client IP address
    private String getClientIpAddress(HttpServletRequest request) {
        // Check for X-Forwarded-For header (common in load balancers/proxies)
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            // Take the first IP if there are multiple
            return xForwardedFor.split(",")[0].trim();
        }

        // Check for X-Real-IP header
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        // Check for X-Forwarded header
        String xForwarded = request.getHeader("X-Forwarded");
        if (xForwarded != null && !xForwarded.isEmpty()) {
            return xForwarded;
        }

        // Check for Forwarded-For header
        String forwardedFor = request.getHeader("Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isEmpty()) {
            return forwardedFor;
        }

        // Check for Forwarded header
        String forwarded = request.getHeader("Forwarded");
        if (forwarded != null && !forwarded.isEmpty()) {
            return forwarded;
        }

        // Fall back to remote address
        return request.getRemoteAddr();
    }
}