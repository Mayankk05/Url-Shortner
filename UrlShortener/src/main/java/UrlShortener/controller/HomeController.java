package UrlShortener.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "URL Shortener Service is running successfully!";
    }

    @GetMapping("/health")
    public String health() {
        return "Service is healthy";
    }

    @GetMapping("/home")  // Alternative home endpoint
    public String homePage() {
        return "Home page - URL Shortener Service";
    }
}