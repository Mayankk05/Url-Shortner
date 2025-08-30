package UrlShortener.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private int jwtExpirationMs;

    public String generateToken(String email) {
        Date expiryDate = new Date(System.currentTimeMillis() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            if (token == null || token.trim().isEmpty()) {
                System.err.println("Token is null or empty");
                return false;
            }

            // FIXED: Better token format validation
            token = token.trim();

            // Check if token has proper JWT format
            String[] parts = token.split("\\.");
            System.out.println("JWT parts count: " + parts.length);

            if (parts.length != 3) {
                System.err.println("Invalid JWT format - expected 3 parts, found: " + parts.length);
                System.err.println("Token: " + token);
                System.err.println("Parts: ");
                for (int i = 0; i < parts.length; i++) {
                    System.err.println("  Part " + i + ": " + parts[i].substring(0, Math.min(parts[i].length(), 20)) + "...");
                }
                return false;
            }

            // Validate each part is not empty
            for (int i = 0; i < parts.length; i++) {
                if (parts[i].isEmpty()) {
                    System.err.println("JWT part " + i + " is empty");
                    return false;
                }
            }

            // Try to parse the token
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);

            System.out.println("JWT validation successful");
            return true;

        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("Invalid JWT token: " + e.getMessage());
            e.printStackTrace();
        }
        return false;
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }
}