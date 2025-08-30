package UrlShortener.controller;



import UrlShortener.dto.request.CreateUrlRequest;
import UrlShortener.dto.response.UrlResponse;
import UrlShortener.model.User;
import UrlShortener.service.UrlService;
import UrlShortener.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/urls")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UrlController {

    @Autowired
    private UrlService urlService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createShortUrl(@Valid @RequestBody CreateUrlRequest request,
                                            Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);
            UrlResponse urlResponse = urlService.createShortUrl(request, user);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", urlResponse);
            response.put("message", "URL shortened successfully");

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserUrls(@RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "20") int size,
                                         @RequestParam(defaultValue = "createdAt") String sort,
                                         @RequestParam(defaultValue = "desc") String direction,
                                         @RequestParam(required = false) String search,
                                         Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);

            Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ?
                    Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));

            Page<UrlResponse> urls;
            if (search != null && !search.trim().isEmpty()) {
                urls = urlService.searchUserUrls(user, search.trim(), pageable);
            } else {
                urls = urlService.getUserUrls(user, pageable);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", urls);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{shortCode}")
    public ResponseEntity<?> getUrlDetails(@PathVariable String shortCode,
                                           Authentication authentication) {
        try {
            // This endpoint is for getting URL metadata, not redirection
            User user = getCurrentUser(authentication);
            // Add authorization check here if needed

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Use the redirect endpoint for actual redirection");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{shortCode}")
    public ResponseEntity<?> deleteUrl(@PathVariable String shortCode,
                                       Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);
            urlService.deleteUrl(shortCode, user);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "URL deleted successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/top")
    public ResponseEntity<?> getTopUrls(@RequestParam(defaultValue = "10") int limit,
                                        Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);
            List<UrlResponse> topUrls = urlService.getTopUrls(user, limit);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", topUrls);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getUserStats(Authentication authentication) {
        try {
            User user = getCurrentUser(authentication);

            long totalUrls = urlService.getUrlCountByUser(user);
            Long totalClicks = urlService.getTotalClicksByUser(user);

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalUrls", totalUrls);
            stats.put("totalClicks", totalClicks);
            stats.put("subscriptionTier", user.getSubscriptionTier());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", stats);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(response);
        }
    }

    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}