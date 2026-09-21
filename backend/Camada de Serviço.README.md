package com.exemplo.achadoseperdidos.service;

import com.exemplo.achadoseperdidos.model.Favorite;
import com.exemplo.achadoseperdidos.model.FavoriteId;
import com.exemplo.achadoseperdidos.model.Item;
import com.exemplo.achadoseperdidos.repository.FavoriteRepository;
import com.exemplo.achadoseperdidos.repository.ItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ItemRepository itemRepository;

    public FavoriteService(FavoriteRepository favoriteRepository, ItemRepository itemRepository) {
        this.favoriteRepository = favoriteRepository;
        this.itemRepository = itemRepository;
    }

    public List<Object> getUserFavorites(Long userId) {
        return favoriteRepository.findItemsByUserId(userId);
    }

    @Transactional
    public void addFavorite(Long userId, Long itemId) {
        FavoriteId id = new FavoriteId(userId, itemId);
        if (!favoriteRepository.existsById(id)) {
            Item item = itemRepository.findById(itemId)
                    .orElseThrow(() -> new RuntimeException("Item não encontrado"));
            
            Favorite favorite = new Favorite(userId, item);
            favoriteRepository.save(favorite);
        }
    }

    @Transactional
    public void removeFavorite(Long userId, Long itemId) {
        FavoriteId id = new FavoriteId(userId, itemId);
        if (favoriteRepository.existsById(id)) {
            favoriteRepository.deleteById(id);
        }
    }
}
