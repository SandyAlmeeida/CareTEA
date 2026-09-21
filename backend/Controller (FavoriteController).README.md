package com.exemplo.achadoseperdidos.controller;

import com.exemplo.achadoseperdidos.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    // GET /favorites — Lista objetos favoritados pelo usuário autenticado
    @GetMapping("/favorites")
    public ResponseEntity<List<Object>> getFavorites(@AuthenticationPrincipal CustomUserDetails user) {
        Long userId = user.getId();
        List<Object> favorites = favoriteService.getUserFavorites(userId);
        return ResponseEntity.ok(favorites);
    }

    // POST /items/{id}/favorite — Favorita um item
    @PostMapping("/items/{id}/favorite")
    public ResponseEntity<Void> addFavorite(
            @PathVariable("id") Long itemId,
            @AuthenticationPrincipal CustomUserDetails user) {
        
        Long userId = user.getId();
        favoriteService.addFavorite(userId, itemId);
        return ResponseEntity.ok().build();
    }

    // DELETE /items/{id}/favorite — Remove dos favoritos
    @DeleteMapping("/items/{id}/favorite")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable("id") Long itemId,
            @AuthenticationPrincipal CustomUserDetails user) {
        
        Long userId = user.getId();
        favoriteService.removeFavorite(userId, itemId);
        return ResponseEntity.noContent().build();
    }
}
