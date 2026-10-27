package com.exemplo.achadoseperdidos.model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class FavoriteId implements Serializable {

    private Long userId;
    private Long itemId;

    public FavoriteId() {}

    public FavoriteId(Long userId, Long itemId) {
        this.userId = userId;
        this.itemId = itemId;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FavoriteId that = (FavoriteId) o;
        return Objects.equals(userId, that.userId) && Objects.equals(itemId, that.itemId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, itemId);
    }
}

package com.exemplo.achadoseperdidos.model;

import jakarta.persistence.*;

@Entity
@Table(name = "favorites")
public class Favorite {

    @EmbeddedId
    private FavoriteId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("itemId")
    @JoinColumn(name = "item_id")
    private Item item;

    public Favorite() {}

    public Favorite(Long userId, Item item) {
        this.id = new FavoriteId(userId, item.getId());
        this.item = item;
    }

    public FavoriteId getId() { return id; }
    public void setId(FavoriteId id) { this.id = id; }

    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }
}
