-- ============================================================
-- Flyway Migration: V1__init_schema.sql
-- NearbyConnect - Initial Database Schema
-- ============================================================

-- ------------------------------------------------------------
-- 1. cities
-- ------------------------------------------------------------
CREATE TABLE cities (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    state       VARCHAR(100),
    country     VARCHAR(100) DEFAULT 'India',
    latitude    DOUBLE,
    longitude   DOUBLE,
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_cities_name UNIQUE (name)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 2. interests
-- ------------------------------------------------------------
CREATE TABLE interests (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL,
    icon        VARCHAR(50),
    category    VARCHAR(50),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_interests_name UNIQUE (name)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 3. users
-- ------------------------------------------------------------
CREATE TABLE users (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    anonymous_name    VARCHAR(50)  NOT NULL,
    anonymous_avatar  VARCHAR(500),
    city_id           BIGINT,
    role              VARCHAR(20) DEFAULT 'USER',
    account_status    VARCHAR(20) DEFAULT 'ACTIVE',
    reputation        INT DEFAULT 0,
    last_active_at    TIMESTAMP NULL,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_anonymous_name UNIQUE (anonymous_name),
    CONSTRAINT fk_users_city
        FOREIGN KEY (city_id) REFERENCES cities (id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_users_anonymous_name ON users (anonymous_name);
CREATE INDEX idx_users_city_id         ON users (city_id);

-- ------------------------------------------------------------
-- 4. user_interests
-- ------------------------------------------------------------
CREATE TABLE user_interests (
    user_id     BIGINT NOT NULL,
    interest_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, interest_id),
    CONSTRAINT fk_ui_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_ui_interest
        FOREIGN KEY (interest_id) REFERENCES interests (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 5. communities
-- ------------------------------------------------------------
CREATE TABLE communities (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    description   TEXT,
    city_id       BIGINT,
    interest_id   BIGINT,
    cover_image   VARCHAR(500),
    member_count  INT DEFAULT 0,
    is_public     BOOLEAN DEFAULT TRUE,
    created_by    BIGINT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_communities_city
        FOREIGN KEY (city_id) REFERENCES cities (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_communities_interest
        FOREIGN KEY (interest_id) REFERENCES interests (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_communities_created_by
        FOREIGN KEY (created_by) REFERENCES users (id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_communities_city_id     ON communities (city_id);
CREATE INDEX idx_communities_interest_id ON communities (interest_id);

-- ------------------------------------------------------------
-- 6. community_members
-- ------------------------------------------------------------
CREATE TABLE community_members (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    community_id  BIGINT NOT NULL,
    user_id       BIGINT NOT NULL,
    role          VARCHAR(20) DEFAULT 'MEMBER',
    joined_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_community_members UNIQUE (community_id, user_id),
    CONSTRAINT fk_cm_community
        FOREIGN KEY (community_id) REFERENCES communities (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_cm_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_community_members_user_id ON community_members (user_id);

-- ------------------------------------------------------------
-- 7. posts
-- ------------------------------------------------------------
CREATE TABLE posts (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    title         VARCHAR(300) NOT NULL,
    content       TEXT,
    post_type     VARCHAR(20) DEFAULT 'TEXT',
    author_id     BIGINT,
    community_id  BIGINT,
    like_count    INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    view_count    INT DEFAULT 0,
    is_pinned     BOOLEAN DEFAULT FALSE,
    is_edited     BOOLEAN DEFAULT FALSE,
    hashtags      VARCHAR(500),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_posts_author
        FOREIGN KEY (author_id) REFERENCES users (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_posts_community
        FOREIGN KEY (community_id) REFERENCES communities (id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_posts_author_id    ON posts (author_id);
CREATE INDEX idx_posts_community_id ON posts (community_id);
CREATE INDEX idx_posts_created_at   ON posts (created_at);
CREATE FULLTEXT INDEX idx_posts_fulltext ON posts (title, content);

-- ------------------------------------------------------------
-- 8. comments
-- ------------------------------------------------------------
CREATE TABLE comments (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    content           TEXT NOT NULL,
    author_id         BIGINT,
    post_id           BIGINT NOT NULL,
    parent_comment_id BIGINT,
    like_count        INT DEFAULT 0,
    is_edited         BOOLEAN DEFAULT FALSE,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_comments_author
        FOREIGN KEY (author_id) REFERENCES users (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_comments_post
        FOREIGN KEY (post_id) REFERENCES posts (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_comments_parent
        FOREIGN KEY (parent_comment_id) REFERENCES comments (id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_comments_post_id           ON comments (post_id);
CREATE INDEX idx_comments_author_id         ON comments (author_id);
CREATE INDEX idx_comments_parent_comment_id ON comments (parent_comment_id);

-- ------------------------------------------------------------
-- 9. likes
-- ------------------------------------------------------------
CREATE TABLE likes (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    post_id     BIGINT NOT NULL,
    comment_id  BIGINT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_likes_user_post UNIQUE (user_id, post_id),
    CONSTRAINT fk_likes_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_likes_post
        FOREIGN KEY (post_id) REFERENCES posts (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_likes_comment
        FOREIGN KEY (comment_id) REFERENCES comments (id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 10. reactions
-- ------------------------------------------------------------
CREATE TABLE reactions (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    reaction_type   VARCHAR(20) NOT NULL,
    user_id         BIGINT NOT NULL,
    post_id         BIGINT NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_reactions_user_post UNIQUE (user_id, post_id),
    CONSTRAINT fk_reactions_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_reactions_post
        FOREIGN KEY (post_id) REFERENCES posts (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 11. bookmarks
-- ------------------------------------------------------------
CREATE TABLE bookmarks (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    post_id     BIGINT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_bookmarks_user_post UNIQUE (user_id, post_id),
    CONSTRAINT fk_bookmarks_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_bookmarks_post
        FOREIGN KEY (post_id) REFERENCES posts (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 12. chat_rooms
-- ------------------------------------------------------------
CREATE TABLE chat_rooms (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100),
    chat_room_type  VARCHAR(20) NOT NULL,
    community_id    BIGINT,
    created_by      BIGINT,
    is_pinned       BOOLEAN DEFAULT FALSE,
    member_count    INT DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_chat_rooms_community
        FOREIGN KEY (community_id) REFERENCES communities (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_chat_rooms_created_by
        FOREIGN KEY (created_by) REFERENCES users (id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 13. chat_room_members
-- ------------------------------------------------------------
CREATE TABLE chat_room_members (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    chat_room_id  BIGINT NOT NULL,
    user_id       BIGINT NOT NULL,
    is_online     BOOLEAN DEFAULT FALSE,
    last_read_at  TIMESTAMP NULL,
    joined_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_chat_room_members UNIQUE (chat_room_id, user_id),
    CONSTRAINT fk_crm_chat_room
        FOREIGN KEY (chat_room_id) REFERENCES chat_rooms (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_crm_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 14. messages
-- ------------------------------------------------------------
CREATE TABLE messages (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    content       TEXT,
    message_type  VARCHAR(20) DEFAULT 'TEXT',
    sender_id     BIGINT,
    chat_room_id  BIGINT NOT NULL,
    is_edited     BOOLEAN DEFAULT FALSE,
    is_deleted    BOOLEAN DEFAULT FALSE,
    is_pinned     BOOLEAN DEFAULT FALSE,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_messages_sender
        FOREIGN KEY (sender_id) REFERENCES users (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_messages_chat_room
        FOREIGN KEY (chat_room_id) REFERENCES chat_rooms (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_messages_chat_room_id ON messages (chat_room_id);
CREATE INDEX idx_messages_sender_id    ON messages (sender_id);
CREATE INDEX idx_messages_created_at   ON messages (created_at);

-- ------------------------------------------------------------
-- 15. notifications
-- ------------------------------------------------------------
CREATE TABLE notifications (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    notification_type VARCHAR(30) NOT NULL,
    recipient_id      BIGINT NOT NULL,
    sender_id         BIGINT,
    message           VARCHAR(500),
    reference_id      BIGINT,
    reference_type    VARCHAR(30),
    is_read           BOOLEAN DEFAULT FALSE,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_recipient
        FOREIGN KEY (recipient_id) REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_notifications_sender
        FOREIGN KEY (sender_id) REFERENCES users (id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_notifications_recipient_id ON notifications (recipient_id);
CREATE INDEX idx_notifications_is_read      ON notifications (is_read);

-- ------------------------------------------------------------
-- 16. reports
-- ------------------------------------------------------------
CREATE TABLE reports (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporter_id     BIGINT,
    reported_user_id BIGINT,
    post_id         BIGINT,
    comment_id      BIGINT,
    reason          VARCHAR(30) NOT NULL,
    description     TEXT,
    status          VARCHAR(20) DEFAULT 'PENDING',
    reviewed_by     BIGINT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_reports_reporter
        FOREIGN KEY (reporter_id) REFERENCES users (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_reports_reported_user
        FOREIGN KEY (reported_user_id) REFERENCES users (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_reports_post
        FOREIGN KEY (post_id) REFERENCES posts (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_reports_comment
        FOREIGN KEY (comment_id) REFERENCES comments (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_reports_reviewed_by
        FOREIGN KEY (reviewed_by) REFERENCES users (id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 17. media
-- ------------------------------------------------------------
CREATE TABLE media (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    url           VARCHAR(500) NOT NULL,
    file_name     VARCHAR(255),
    file_type     VARCHAR(50),
    file_size     BIGINT,
    uploaded_by   BIGINT,
    post_id       BIGINT,
    community_id  BIGINT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_media_uploaded_by
        FOREIGN KEY (uploaded_by) REFERENCES users (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_media_post
        FOREIGN KEY (post_id) REFERENCES posts (id)
        ON DELETE SET NULL,
    CONSTRAINT fk_media_community
        FOREIGN KEY (community_id) REFERENCES communities (id)
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 18. blocks
-- ------------------------------------------------------------
CREATE TABLE blocks (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    blocker_id  BIGINT NOT NULL,
    blocked_id  BIGINT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_blocks_pair UNIQUE (blocker_id, blocked_id),
    CONSTRAINT fk_blocks_blocker
        FOREIGN KEY (blocker_id) REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_blocks_blocked
        FOREIGN KEY (blocked_id) REFERENCES users (id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 19. audit_logs
-- ------------------------------------------------------------
CREATE TABLE audit_logs (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    action        VARCHAR(50) NOT NULL,
    entity_type   VARCHAR(50),
    entity_id     BIGINT,
    performed_by  VARCHAR(50),
    details       TEXT,
    ip_address    VARCHAR(45),
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- ============================================================
-- SEED DATA
-- ============================================================

-- ------------------------------------------------------------
-- Cities
-- ------------------------------------------------------------
INSERT INTO cities (name, state, country, latitude, longitude) VALUES
    ('Durgapur',  'West Bengal',  'India', 23.5204, 87.3119),
    ('Kolkata',   'West Bengal',  'India', 22.5726, 88.3639),
    ('Delhi',     'Delhi',        'India', 28.7041, 77.1025),
    ('Mumbai',    'Maharashtra',  'India', 19.0760, 72.8777),
    ('Bangalore', 'Karnataka',    'India', 12.9716, 77.5946);

-- ------------------------------------------------------------
-- Interests
-- ------------------------------------------------------------
INSERT INTO interests (name, icon, category) VALUES
    ('Coding',      'code',          'Technology'),
    ('Gaming',      'gamepad-2',     'Entertainment'),
    ('Music',       'music',         'Entertainment'),
    ('Movies',      'film',          'Entertainment'),
    ('Cricket',     'trophy',        'Sports'),
    ('Photography', 'camera',        'Creative'),
    ('Business',    'briefcase',     'Professional'),
    ('AI',          'brain',         'Technology'),
    ('Travel',      'map-pin',       'Lifestyle'),
    ('Food',        'utensils',      'Lifestyle');

-- ------------------------------------------------------------
-- Admin user
-- ------------------------------------------------------------
INSERT INTO users (anonymous_name, role, account_status, reputation)
VALUES ('Admin-0001', 'ADMIN', 'ACTIVE', 1000);

-- ------------------------------------------------------------
-- Communities: one per interest in Durgapur (city_id = 1)
-- created_by = 1 (Admin-0001)
-- ------------------------------------------------------------
INSERT INTO communities (name, description, city_id, interest_id, member_count, is_public, created_by) VALUES
    ('Durgapur Coders',           'For developers and coders in Durgapur',                    1, 1, 0, TRUE, 1),
    ('Durgapur Gamers',           'Gamers unite in Durgapur',                                 1, 2, 0, TRUE, 1),
    ('Durgapur Music Lovers',     'Share and discover music in Durgapur',                     1, 3, 0, TRUE, 1),
    ('Durgapur Movie Buffs',      'Movie discussions and reviews in Durgapur',                1, 4, 0, TRUE, 1),
    ('Durgapur Cricket Club',     'Cricket enthusiasts of Durgapur',                          1, 5, 0, TRUE, 1),
    ('Durgapur Photographers',    'Capture and share moments in Durgapur',                    1, 6, 0, TRUE, 1),
    ('Durgapur Business Network', 'Networking for entrepreneurs in Durgapur',                 1, 7, 0, TRUE, 1),
    ('Durgapur AI Enthusiasts',   'Exploring artificial intelligence in Durgapur',            1, 8, 0, TRUE, 1),
    ('Durgapur Travel Club',      'Plan trips and share travel stories from Durgapur',         1, 9, 0, TRUE, 1),
    ('Durgapur Foodies',          'Food recommendations and recipes from Durgapur',            1, 10, 0, TRUE, 1);
