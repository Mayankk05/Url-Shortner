package UrlShortener.repository;

import UrlShortener.model.Url;
import UrlShortener.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UrlRepository extends JpaRepository<Url, Long> {

    Optional<Url> findByShortCode(String shortCode);

    boolean existsByShortCode(String shortCode);

    Page<Url> findByUserAndIsActiveOrderByCreatedAtDesc(User user, Boolean isActive, Pageable pageable);

    // FIXED: Correct LIKE syntax in JPQL
    @Query("SELECT u FROM Url u WHERE u.user = :user AND u.isActive = true AND " +
            "(LOWER(u.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.originalUrl) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Url> findByUserAndSearchTerm(@Param("user") User user, @Param("search") String search, Pageable pageable);

    @Query("SELECT u FROM Url u WHERE u.user = :user AND u.isActive = true ORDER BY u.clickCount DESC")
    List<Url> findTopUrlsByUser(@Param("user") User user, Pageable pageable);

    @Query("SELECT SUM(u.clickCount) FROM Url u WHERE u.user = :user AND u.isActive = true")
    Long getTotalClicksByUser(@Param("user") User user);

    @Query("SELECT COUNT(u) FROM Url u WHERE u.user = :user AND u.isActive = true")
    long countActiveUrlsByUser(@Param("user") User user);
}