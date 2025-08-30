package UrlShortener.dto.response;


import UrlShortener.model.User;

public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private User.SubscriptionTier subscriptionTier;

    // Constructors
    public AuthResponse() {}

    public AuthResponse(String token, User user) {
        this.token = token;
        this.userId = user.getId();
        this.email = user.getEmail();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.subscriptionTier = user.getSubscriptionTier();
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public User.SubscriptionTier getSubscriptionTier() { return subscriptionTier; }
    public void setSubscriptionTier(User.SubscriptionTier subscriptionTier) { this.subscriptionTier = subscriptionTier; }
}