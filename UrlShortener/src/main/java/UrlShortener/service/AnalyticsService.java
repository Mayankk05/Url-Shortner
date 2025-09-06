package UrlShortener.service;

import UrlShortener.dto.response.AnalyticsResponse;
import UrlShortener.model.ClickEvent;
import UrlShortener.model.Url;
import UrlShortener.model.User;
import UrlShortener.repository.ClickEventRepository;
import UrlShortener.repository.UrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AnalyticsService {

    @Autowired
    private ClickEventRepository clickEventRepository;

    @Autowired
    private UrlRepository urlRepository;
    public AnalyticsResponse getUrlAnalytics(String shortCode, int days) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("URL not found: " + shortCode));

        AnalyticsResponse response = new AnalyticsResponse(shortCode);

        try {
            // Basic metrics
            response.setTotalClicks(clickEventRepository.countByUrl(url));
            response.setClicksToday(getClicksSince(url, LocalDateTime.now().minusDays(1)));
            response.setClicksThisWeek(getClicksSince(url, LocalDateTime.now().minusDays(7)));
            response.setClicksThisMonth(getClicksSince(url, LocalDateTime.now().minusDays(30)));

            // Daily clicks for the specified period
            LocalDateTime startDate = LocalDateTime.now().minusDays(days);
            List<Object[]> dailyData = clickEventRepository.getDailyClickStats(url, startDate);
            List<AnalyticsResponse.DailyClickData> dailyClicks = dailyData.stream()
                    .map(data -> new AnalyticsResponse.DailyClickData(
                            ((java.sql.Date) data[0]).toLocalDate(),
                            ((Number) data[1]).longValue()))
                    .collect(Collectors.toList());
            response.setDailyClicks(dailyClicks);

            // Geographic distribution
            List<Object[]> countryData = clickEventRepository.getClicksByCountry(url);
            long totalClicks = response.getTotalClicks();
            List<AnalyticsResponse.CountryClickData> countryClicks = countryData.stream()
                    .limit(10)
                    .map(data -> {
                        String country = (String) data[0];
                        Long clicks = ((Number) data[1]).longValue();
                        Double percentage = totalClicks > 0 ? (clicks * 100.0) / totalClicks : 0.0;
                        return new AnalyticsResponse.CountryClickData(country, clicks, percentage);
                    })
                    .collect(Collectors.toList());
            response.setTopCountries(countryClicks);

            // Browser statistics
            List<Object[]> browserData = clickEventRepository.getClicksByBrowser(url);
            List<AnalyticsResponse.BrowserClickData> browserStats = browserData.stream()
                    .limit(10)
                    .map(data -> {
                        String browser = (String) data[0];
                        Long clicks = ((Number) data[1]).longValue();
                        Double percentage = totalClicks > 0 ? (clicks * 100.0) / totalClicks : 0.0;
                        return new AnalyticsResponse.BrowserClickData(browser, clicks, percentage);
                    })
                    .collect(Collectors.toList());
            response.setBrowserStats(browserStats);

            // Device statistics
            List<Object[]> deviceData = clickEventRepository.getClicksByDeviceType(url);
            List<AnalyticsResponse.DeviceClickData> deviceStats = deviceData.stream()
                    .map(data -> {
                        String deviceType = data[0].toString();
                        Long clicks = ((Number) data[1]).longValue();
                        Double percentage = totalClicks > 0 ? (clicks * 100.0) / totalClicks : 0.0;
                        return new AnalyticsResponse.DeviceClickData(deviceType, clicks, percentage);
                    })
                    .collect(Collectors.toList());
            response.setDeviceStats(deviceStats);

        } catch (Exception e) {
            System.err.println("Error getting analytics for " + shortCode + ": " + e.getMessage());
            // Return response with basic data even if detailed analytics fail
        }

        return response;
    }

    public AnalyticsResponse getUserDashboard(User user) {
        Long totalClicks = urlRepository.getTotalClicksByUser(user);
        long totalUrls = urlRepository.countActiveUrlsByUser(user);

        AnalyticsResponse dashboard = new AnalyticsResponse("dashboard");
        dashboard.setTotalClicks(totalClicks != null ? totalClicks : 0L);

        return dashboard;
    }

    @Async
    public void recordClickEvent(Url url, String ipAddress, String userAgent, String referrer) {
        try {
            ClickEvent clickEvent = new ClickEvent();
            clickEvent.setUrl(url);
            clickEvent.setIpAddress(anonymizeIp(ipAddress));
            clickEvent.setUserAgent(userAgent);
            clickEvent.setReferrer(referrer);

            enrichClickEvent(clickEvent, ipAddress, userAgent);
            clickEventRepository.save(clickEvent);

            System.out.println("Click event recorded for: " + url.getShortCode());
        } catch (Exception e) {
            System.err.println("Failed to record click event: " + e.getMessage());
        }
    }

    private long getClicksSince(Url url, LocalDateTime since) {
        return clickEventRepository.countByUrlAndClickedAtAfter(url, since);
    }

    private void enrichClickEvent(ClickEvent clickEvent, String ipAddress, String userAgent) {
        clickEvent.setCountry("Unknown");
        clickEvent.setCity("Unknown");
        parseUserAgent(clickEvent, userAgent);
    }

    private void parseUserAgent(ClickEvent clickEvent, String userAgent) {
        if (userAgent == null || userAgent.isEmpty()) {
            return;
        }

        userAgent = userAgent.toLowerCase();

        // Simple browser detection
        if (userAgent.contains("chrome")) {
            clickEvent.setBrowser("Chrome");
        } else if (userAgent.contains("firefox")) {
            clickEvent.setBrowser("Firefox");
        } else if (userAgent.contains("safari") && !userAgent.contains("chrome")) {
            clickEvent.setBrowser("Safari");
        } else if (userAgent.contains("edge")) {
            clickEvent.setBrowser("Edge");
        } else {
            clickEvent.setBrowser("Other");
        }

        // Simple OS detection
        if (userAgent.contains("windows")) {
            clickEvent.setOperatingSystem("Windows");
        } else if (userAgent.contains("mac")) {
            clickEvent.setOperatingSystem("macOS");
        } else if (userAgent.contains("linux")) {
            clickEvent.setOperatingSystem("Linux");
        } else if (userAgent.contains("android")) {
            clickEvent.setOperatingSystem("Android");
        } else if (userAgent.contains("iphone") || userAgent.contains("ipad")) {
            clickEvent.setOperatingSystem("iOS");
        } else {
            clickEvent.setOperatingSystem("Other");
        }

        // Simple device type detection
        if (userAgent.contains("mobile") || userAgent.contains("android") || userAgent.contains("iphone")) {
            clickEvent.setDeviceType(ClickEvent.DeviceType.MOBILE);
        } else if (userAgent.contains("tablet") || userAgent.contains("ipad")) {
            clickEvent.setDeviceType(ClickEvent.DeviceType.TABLET);
        } else if (userAgent.contains("bot") || userAgent.contains("crawler") || userAgent.contains("spider")) {
            clickEvent.setDeviceType(ClickEvent.DeviceType.BOT);
        } else {
            clickEvent.setDeviceType(ClickEvent.DeviceType.DESKTOP);
        }
    }

    private String anonymizeIp(String ipAddress) {
        if (ipAddress == null || ipAddress.isEmpty()) {
            return ipAddress;
        }

        String[] parts = ipAddress.split("\\.");
        if (parts.length == 4) {
            return parts[0] + "." + parts[1] + "." + parts[2] + ".0";
        }

        return ipAddress;
    }
}
