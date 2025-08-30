package UrlShortener.dto.response;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class AnalyticsResponse {

    private String shortCode;
    private Long totalClicks;
    private Long clicksToday;
    private Long clicksThisWeek;
    private Long clicksThisMonth;
    private List<DailyClickData> dailyClicks;
    private List<CountryClickData> topCountries;
    private List<BrowserClickData> browserStats;
    private List<DeviceClickData> deviceStats;

    // Constructors
    public AnalyticsResponse() {}

    public AnalyticsResponse(String shortCode) {
        this.shortCode = shortCode;
    }

    // Getters and Setters
    public String getShortCode() { return shortCode; }
    public void setShortCode(String shortCode) { this.shortCode = shortCode; }

    public Long getTotalClicks() { return totalClicks; }
    public void setTotalClicks(Long totalClicks) { this.totalClicks = totalClicks; }

    public Long getClicksToday() { return clicksToday; }
    public void setClicksToday(Long clicksToday) { this.clicksToday = clicksToday; }

    public Long getClicksThisWeek() { return clicksThisWeek; }
    public void setClicksThisWeek(Long clicksThisWeek) { this.clicksThisWeek = clicksThisWeek; }

    public Long getClicksThisMonth() { return clicksThisMonth; }
    public void setClicksThisMonth(Long clicksThisMonth) { this.clicksThisMonth = clicksThisMonth; }

    public List<DailyClickData> getDailyClicks() { return dailyClicks; }
    public void setDailyClicks(List<DailyClickData> dailyClicks) { this.dailyClicks = dailyClicks; }

    public List<CountryClickData> getTopCountries() { return topCountries; }
    public void setTopCountries(List<CountryClickData> topCountries) { this.topCountries = topCountries; }

    public List<BrowserClickData> getBrowserStats() { return browserStats; }
    public void setBrowserStats(List<BrowserClickData> browserStats) { this.browserStats = browserStats; }

    public List<DeviceClickData> getDeviceStats() { return deviceStats; }
    public void setDeviceStats(List<DeviceClickData> deviceStats) { this.deviceStats = deviceStats; }

    // Inner classes for structured data
    public static class DailyClickData {
        private LocalDate date;
        private Long clicks;

        public DailyClickData(LocalDate date, Long clicks) {
            this.date = date;
            this.clicks = clicks;
        }

        // Getters and Setters
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }

        public Long getClicks() { return clicks; }
        public void setClicks(Long clicks) { this.clicks = clicks; }
    }

    public static class CountryClickData {
        private String country;
        private Long clicks;
        private Double percentage;

        public CountryClickData(String country, Long clicks, Double percentage) {
            this.country = country;
            this.clicks = clicks;
            this.percentage = percentage;
        }

        // Getters and Setters
        public String getCountry() { return country; }
        public void setCountry(String country) { this.country = country; }

        public Long getClicks() { return clicks; }
        public void setClicks(Long clicks) { this.clicks = clicks; }

        public Double getPercentage() { return percentage; }
        public void setPercentage(Double percentage) { this.percentage = percentage; }
    }

    public static class BrowserClickData {
        private String browser;
        private Long clicks;
        private Double percentage;

        public BrowserClickData(String browser, Long clicks, Double percentage) {
            this.browser = browser;
            this.clicks = clicks;
            this.percentage = percentage;
        }

        // Getters and Setters
        public String getBrowser() { return browser; }
        public void setBrowser(String browser) { this.browser = browser; }

        public Long getClicks() { return clicks; }
        public void setClicks(Long clicks) { this.clicks = clicks; }

        public Double getPercentage() { return percentage; }
        public void setPercentage(Double percentage) { this.percentage = percentage; }
    }

    public static class DeviceClickData {
        private String deviceType;
        private Long clicks;
        private Double percentage;

        public DeviceClickData(String deviceType, Long clicks, Double percentage) {
            this.deviceType = deviceType;
            this.clicks = clicks;
            this.percentage = percentage;
        }

        // Getters and Setters
        public String getDeviceType() { return deviceType; }
        public void setDeviceType(String deviceType) { this.deviceType = deviceType; }

        public Long getClicks() { return clicks; }
        public void setClicks(Long clicks) { this.clicks = clicks; }

        public Double getPercentage() { return percentage; }
        public void setPercentage(Double percentage) { this.percentage = percentage; }
    }
}