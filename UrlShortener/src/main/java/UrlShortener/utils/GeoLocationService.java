package UrlShortener.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class GeoLocationService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Using a free IP geolocation service
    private static final String GEO_API_URL = "http://ip-api.com/json/";

    public LocationInfo getLocationInfo(String ipAddress) {
        try {
            // Skip for local/private IPs
            if (isPrivateIp(ipAddress)) {
                return new LocationInfo("Unknown", "Unknown");
            }

            String url = GEO_API_URL + ipAddress;
            String response = restTemplate.getForObject(url, String.class);

            JsonNode json = objectMapper.readTree(response);

            if ("success".equals(json.get("status").asText())) {
                String country = json.get("country").asText();
                String city = json.get("city").asText();

                return new LocationInfo(country, city);
            }

        } catch (Exception e) {
            // Log error but don't fail
            System.err.println("Failed to get location info: " + e.getMessage());
        }

        return new LocationInfo("Unknown", "Unknown");
    }

    private boolean isPrivateIp(String ip) {
        return ip.startsWith("192.168.") ||
                ip.startsWith("10.") ||
                ip.startsWith("172.") ||
                ip.equals("127.0.0.1") ||
                ip.equals("localhost");
    }

    public static class LocationInfo {
        private final String country;
        private final String city;

        public LocationInfo(String country, String city) {
            this.country = country;
            this.city = city;
        }

        public String getCountry() { return country; }
        public String getCity() { return city; }
    }
}