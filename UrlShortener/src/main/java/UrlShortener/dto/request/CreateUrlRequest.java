package UrlShortener.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDateTime;

public class CreateUrlRequest {

    @NotBlank(message = "Original URL is required")
    @Pattern(regexp = "^https?://.*", message = "URL must start with http:// or https://")
    private String originalUrl;

    @Size(max = 500, message = "Title cannot exceed 500 characters")
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;

    private LocalDateTime expiresAt;

    // Constructors
    public CreateUrlRequest() {}

    public CreateUrlRequest(String originalUrl, String title) {
        this.originalUrl = originalUrl;
        this.title = title;
    }

    // Getters and Setters
    public String getOriginalUrl() { return originalUrl; }
    public void setOriginalUrl(String originalUrl) { this.originalUrl = originalUrl; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}