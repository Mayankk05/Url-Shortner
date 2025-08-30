package UrlShortener.dto.response;

import UrlShortener.model.Url;

import java.time.LocalDateTime;

public class UrlResponse {

    private Long id;
    private String shortCode;
    private String shortUrl;
    private String originalUrl;
    private String title;
    private String description;
    private Long clickCount;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    // Constructors
    public UrlResponse() {}

    public UrlResponse(Url url, String baseUrl) {
        this.id = url.getId();
        this.shortCode = url.getShortCode();
        this.shortUrl = baseUrl + "/" + url.getShortCode();
        this.originalUrl = url.getOriginalUrl();
        this.title = url.getTitle();
        this.description = url.getDescription();
        this.clickCount = url.getClickCount();
        this.isActive = url.getIsActive();
        this.createdAt = url.getCreatedAt();
        this.expiresAt = url.getExpiresAt();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getShortCode() { return shortCode; }
    public void setShortCode(String shortCode) { this.shortCode = shortCode; }

    public String getShortUrl() { return shortUrl; }
    public void setShortUrl(String shortUrl) { this.shortUrl = shortUrl; }

    public String getOriginalUrl() { return originalUrl; }
    public void setOriginalUrl(String originalUrl) { this.originalUrl = originalUrl; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getClickCount() { return clickCount; }
    public void setClickCount(Long clickCount) { this.clickCount = clickCount; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}