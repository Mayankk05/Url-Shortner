package UrlShortener.service;

import UrlShortener.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendWelcomeEmail(User user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Welcome to URL Shortener!");
            message.setText(buildWelcomeEmailContent(user));

            mailSender.send(message);
        } catch (Exception e) {
            // Log error but don't fail the registration process
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(User user, String resetToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Password Reset Request");
            message.setText(buildPasswordResetEmailContent(user, resetToken));

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send password reset email: " + e.getMessage());
        }
    }

    private String buildWelcomeEmailContent(User user) {
        return String.format(
                "Hi %s,\n\n" +
                        "Welcome to URL Shortener! Your account has been successfully created.\n\n" +
                        "You can now start creating short URLs and tracking their performance.\n\n" +
                        "Best regards,\n" +
                        "The URL Shortener Team",
                user.getFirstName() != null ? user.getFirstName() : "there"
        );
    }

    private String buildPasswordResetEmailContent(User user, String resetToken) {
        return String.format(
                "Hi %s,\n\n" +
                        "You requested a password reset for your URL Shortener account.\n\n" +
                        "Click the following link to reset your password:\n" +
                        "http://localhost:3000/reset-password?token=%s\n\n" +
                        "If you didn't request this, please ignore this email.\n\n" +
                        "Best regards,\n" +
                        "The URL Shortener Team",
                user.getFirstName() != null ? user.getFirstName() : "there",
                resetToken
        );
    }
}