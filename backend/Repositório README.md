package com.exemplo.achadoseperdidos.repository;

import com.exemplo.achadoseperdidos.model.Favorite;
import com.exemplo.achadoseperdidos.model.FavoriteId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, FavoriteId> {

    @Query("SELECT f.item FROM Favorite f WHERE f.id.userId = :userId")
    List<Object> findItemsByUserId(@Param("userId") Long userId);
}
