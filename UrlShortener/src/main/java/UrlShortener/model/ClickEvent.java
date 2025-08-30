package UrlShortener.model;

import com.fasterxml.jackson.annotation.JsonBackReference; // <-- IMPORT ADDED
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "click_events")
@EntityListeners(AuditingEntityListener.class)
public class ClickEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "user_agent", length = 1000)
    private String userAgent;

    @Column(length = 500)
    private String referrer;

    @Column(length = 100)
    private String country;

    @Column(length = 100)
    private String city;

    @Column(name = "device_type")
    @Enumerated(EnumType.STRING)
    private DeviceType deviceType;

    @Column(length = 100)
    private String browser;

    @Column(name = "operating_system", length = 100)
    private String operatingSystem;

    @CreatedDate
    @Column(name = "clicked_at")
    private LocalDateTime clickedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "url_id")
    @JsonBackReference // <-- ANNOTATION ADDED
    private Url url;

    // Constructors
    public ClickEvent() {}

    public ClickEvent(String ipAddress, String userAgent, String referrer, Url url) {
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.referrer = referrer;
        this.url = url;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }

    public String getReferrer() { return referrer; }
    public void setReferrer(String referrer) { this.referrer = referrer; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public DeviceType getDeviceType() { return deviceType; }
    public void setDeviceType(DeviceType deviceType) { this.deviceType = deviceType; }

    public String getBrowser() { return browser; }
    public void setBrowser(String browser) { this.browser = browser; }

    public String getOperatingSystem() { return operatingSystem; }
    public void setOperatingSystem(String operatingSystem) { this.operatingSystem = operatingSystem; }

    public LocalDateTime getClickedAt() { return clickedAt; }
    public void setClickedAt(LocalDateTime clickedAt) { this.clickedAt = clickedAt; }

    public Url getUrl() { return url; }
    public void setUrl(Url url) { this.url = url; }

    public enum DeviceType {
        DESKTOP, MOBILE, TABLET, BOT, OTHER
    }
}