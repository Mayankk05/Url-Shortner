package UrlShortener.utils;

import org.springframework.stereotype.Component;
import java.net.URL;
import java.util.regex.Pattern;

@Component
public class UrlValidator {

    private static final Pattern URL_PATTERN = Pattern.compile(
            "^(https?://)?([-\\w\\.]+)+(\\.([a-zA-Z]{2,}))+(/.*)?$"
    );

    public boolean isValid(String url) {
        if (url == null || url.trim().isEmpty()) {
            return false;
        }

        try {
            // Add protocol if missing
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                url = "https://" + url;
            }

            // Validate URL format
            new URL(url);
            return URL_PATTERN.matcher(url).matches();

        } catch (Exception e) {
            return false;
        }
    }
}