package UrlShortener.repository;

import UrlShortener.model.ClickEvent;
import UrlShortener.model.Url;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ClickEventRepository extends JpaRepository<ClickEvent, Long> {

    List<ClickEvent> findByUrlOrderByClickedAtDesc(Url url);

    @Query("SELECT COUNT(c) FROM ClickEvent c WHERE c.url = :url")
    long countByUrl(@Param("url") Url url);

    @Query("SELECT COUNT(c) FROM ClickEvent c WHERE c.url = :url AND c.clickedAt >= :startDate")
    long countByUrlAndClickedAtAfter(@Param("url") Url url, @Param("startDate") LocalDateTime startDate);

    @Query("SELECT c.country, COUNT(c) FROM ClickEvent c WHERE c.url = :url AND c.country IS NOT NULL " +
            "GROUP BY c.country ORDER BY COUNT(c) DESC")
    List<Object[]> getClicksByCountry(@Param("url") Url url);

    @Query("SELECT DATE(c.clickedAt), COUNT(c) FROM ClickEvent c WHERE c.url = :url AND " +
            "c.clickedAt >= :startDate GROUP BY DATE(c.clickedAt) ORDER BY DATE(c.clickedAt)")
    List<Object[]> getDailyClickStats(@Param("url") Url url, @Param("startDate") LocalDateTime startDate);

    @Query("SELECT c.browser, COUNT(c) FROM ClickEvent c WHERE c.url = :url AND c.browser IS NOT NULL " +
            "GROUP BY c.browser ORDER BY COUNT(c) DESC")
    List<Object[]> getClicksByBrowser(@Param("url") Url url);

    @Query("SELECT c.deviceType, COUNT(c) FROM ClickEvent c WHERE c.url = :url AND c.deviceType IS NOT NULL " +
            "GROUP BY c.deviceType ORDER BY COUNT(c) DESC")
    List<Object[]> getClicksByDeviceType(@Param("url") Url url);
}