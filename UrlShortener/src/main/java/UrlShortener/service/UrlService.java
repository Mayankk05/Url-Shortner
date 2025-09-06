package UrlShortener.service;

import UrlShortener.dto.request.CreateUrlRequest;
import UrlShortener.dto.response.UrlResponse;
import UrlShortener.exception.ResourceNotFoundException;
import UrlShortener.exception.ValidationException;
import UrlShortener.model.Url;
import UrlShortener.model.User;
import UrlShortener.repository.UrlRepository;
import UrlShortener.utils.ShortCodeGenerator;
import UrlShortener.utils.UrlValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UrlService {

    @Autowired
    private UrlRepository urlRepository;

    @Autowired
    private ShortCodeGenerator shortCodeGenerator;

    @Autowired
    private UrlValidator urlValidator;

    @Value("${app.base-url}")
    private String baseUrl;

    public UrlResponse createShortUrl(CreateUrlRequest request, User user) {
        if (!urlValidator.isValid(request.getOriginalUrl())) {
            throw new ValidationException("Invalid URL format or blocked URL");
        }

        checkSubscriptionLimits(user);
        String shortCode = generateUniqueShortCode();

        Url url = new Url();
        url.setShortCode(shortCode);
        url.setOriginalUrl(request.getOriginalUrl());
        url.setTitle(request.getTitle());
        url.setDescription(request.getDescription());
        url.setExpiresAt(request.getExpiresAt());
        url.setUser(user);
        url.setIsActive(true);
        url.setClickCount(0L);

        Url savedUrl = urlRepository.save(url);
        return new UrlResponse(savedUrl, baseUrl);
    }

    public Page<UrlResponse> getUserUrls(User user, Pageable pageable) {
        Page<Url> urls = urlRepository.findByUserAndIsActiveOrderByCreatedAtDesc(user, true, pageable);
        return urls.map(url -> new UrlResponse(url, baseUrl));
    }

    public Page<UrlResponse> searchUserUrls(User user, String searchTerm, Pageable pageable) {
        Page<Url> urls = urlRepository.findByUserAndSearchTerm(user, searchTerm, pageable);
        return urls.map(url -> new UrlResponse(url, baseUrl));
    }

    @CacheEvict(value = "urls", key = "#shortCode")
    public void deleteUrl(String shortCode, User user) {
        Url url = findByShortCode(shortCode);

        if (!url.getUser().getId().equals(user.getId())) {
            throw new ValidationException("You don't have permission to delete this URL");
        }

        url.setIsActive(false);
        urlRepository.save(url);
    }

    public List<UrlResponse> getTopUrls(User user, int limit) {
        List<Url> topUrls = urlRepository.findTopUrlsByUser(user, Pageable.ofSize(limit));
        return topUrls.stream()
                .map(url -> new UrlResponse(url, baseUrl))
                .collect(Collectors.toList());
    }

    public Long getTotalClicksByUser(User user) {
        Long totalClicks = urlRepository.getTotalClicksByUser(user);
        return totalClicks != null ? totalClicks : 0L;
    }

    public long getUrlCountByUser(User user) {
        return urlRepository.countActiveUrlsByUser(user);
    }

    @Cacheable(value = "urls", key = "#shortCode")
    public Url findByShortCode(String shortCode) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException("URL not found: " + shortCode));
        if (url.getUser() != null) {
            url.getUser().getId();
            url.getUser().getEmail();
            url.getUser().getFirstName();
        }

        return url;
    }

    @Transactional
    @CacheEvict(value = "urls", key = "#url.shortCode")
    public void incrementClickCount(Url url) {
        url.incrementClickCount();
        urlRepository.save(url);
    }

    private String generateUniqueShortCode() {
        String shortCode;
        int attempts = 0;
        int maxAttempts = 5;

        do {
            shortCode = shortCodeGenerator.generate();
            attempts++;

            if (attempts > maxAttempts) {
                throw new RuntimeException("Unable to generate unique short code after " + maxAttempts + " attempts");
            }
        } while (urlRepository.existsByShortCode(shortCode));

        return shortCode;
    }

    private void checkSubscriptionLimits(User user) {
        long currentUrlCount = getUrlCountByUser(user);

        switch (user.getSubscriptionTier()) {
            case FREE:
                if (currentUrlCount >= 100) {
                    throw new ValidationException("Free tier limit reached. Upgrade to create more URLs.");
                }
                break;
            case PREMIUM:
                if (currentUrlCount >= 10000) {
                    throw new ValidationException("Premium tier limit reached. Contact support for higher limits.");
                }
                break;
            case ENTERPRISE:
                break;
        }
    }
}
