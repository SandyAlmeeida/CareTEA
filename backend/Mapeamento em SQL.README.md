CREATE TABLE favorites (
    user_id BIGINT NOT NULL,
    item_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, item_id),
    CONSTRAINT fk_favorites_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
