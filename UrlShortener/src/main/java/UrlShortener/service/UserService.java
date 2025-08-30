package UrlShortener.service;


import UrlShortener.dto.request.RegisterRequest;
import UrlShortener.exception.ResourceNotFoundException;
import UrlShortener.exception.ValidationException;
import UrlShortener.model.User;
import UrlShortener.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.Optional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    public User registerUser(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ValidationException("Email already exists");
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setSubscriptionTier(User.SubscriptionTier.FREE);
        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        // Send welcome email (async)
        emailService.sendWelcomeEmail(savedUser);

        return savedUser;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User updateUser(Long id, User userDetails) {
        User user = findById(id);

        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = findById(id);
        user.setIsActive(false);
        userRepository.save(user);
    }

    public boolean isEmailTaken(String email) {
        return userRepository.existsByEmail(email);
    }

    public long getTotalUsers() {
        return userRepository.count();
    }

    public long getActiveUsers() {
        return userRepository.countActiveUsers();
    }
}