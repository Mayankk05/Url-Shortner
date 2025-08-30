# Url-Shortner
URL Shortener
This is a full-stack URL shortener application built with a Spring Boot backend and a React frontend. It allows users to shorten long URLs, track click analytics, and manage their links.

Features
URL Shortening: Create short, custom URLs for long links.

User Authentication: Secure user registration and login with JWT authentication.

Dashboard: An overview of your URL statistics, including total URLs, total clicks, and top-performing links.

Detailed Analytics: For each shortened URL, you can view:

Click-through rates over time (last 7, 30, 90, or 365 days).

Geographic distribution of clicks.

Device and browser breakdowns.

URL Management: A paginated and searchable list of all your shortened URLs. You can sort by creation date, click count, or title.

User Profile Management: Update your user profile information.

Guest URL Shortening: Unauthenticated users can quickly shorten URLs from the landing page.

Tech Stack
Backend (UrlShortener)
Java 21

Spring Boot 3

Spring Security: For authentication and authorization.

Spring Data JPA (Hibernate): For database interaction.

MySQL: As the primary database.

Redis: For caching.

JJWT: For JSON Web Token generation and validation.

Maven: For dependency management.

Frontend (url-shortner-fronted)
React 19

Vite: As the build tool.

React Router 7: For routing.

Axios: For making API requests.

Chart.js: For data visualization.

Tailwind CSS: For styling.

Lucide React: For icons.

Getting Started
Prerequisites
Java 21 or later

Maven

Node.js and npm (or yarn)

MySQL

Redis

mvn spring-boot:run
The backend will be running on http://localhost:8080.
