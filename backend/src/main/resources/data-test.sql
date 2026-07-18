-- Seed data for test profile (H2)

-- Cities
INSERT INTO cities (id, name, state, country, latitude, longitude, is_active, created_at, updated_at) VALUES
    (1, 'Durgapur',  'West Bengal',  'India', 23.5204, 87.3119, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'Kolkata',   'West Bengal',  'India', 22.5726, 88.3639, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 'Delhi',     'Delhi',        'India', 28.7041, 77.1025, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4, 'Mumbai',    'Maharashtra',  'India', 19.0760, 72.8777, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5, 'Bangalore', 'Karnataka',    'India', 12.9716, 77.5946, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Interests
INSERT INTO interests (id, name, icon, category, created_at, updated_at) VALUES
    (1,  'Coding',      'code',          'Technology',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2,  'Gaming',      'gamepad-2',     'Entertainment', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3,  'Music',       'music',         'Entertainment', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4,  'Movies',      'film',          'Entertainment', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5,  'Cricket',     'trophy',        'Sports',     CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (6,  'Photography', 'camera',        'Creative',   CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (7,  'Business',    'briefcase',     'Professional', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (8,  'AI',          'brain',         'Technology',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (9,  'Travel',      'map-pin',       'Lifestyle',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (10, 'Food',        'utensils',      'Lifestyle',  CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Admin user
INSERT INTO users (id, anonymous_name, role, account_status, reputation, created_at, updated_at) VALUES
    (1, 'Admin-0001', 'ADMIN', 'ACTIVE', 1000, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Communities
INSERT INTO communities (id, name, description, city_id, interest_id, member_count, is_public, created_by_id, created_at, updated_at) VALUES
    (1,  'Durgapur Coders',           'For developers and coders in Durgapur',            1, 1,  0, TRUE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2,  'Durgapur Gamers',           'Gamers unite in Durgapur',                         1, 2,  0, TRUE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3,  'Durgapur Music Lovers',     'Share and discover music in Durgapur',             1, 3,  0, TRUE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4,  'Durgapur Movie Buffs',      'Movie discussions and reviews in Durgapur',        1, 4,  0, TRUE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5,  'Durgapur Cricket Club',     'Cricket enthusiasts of Durgapur',                  1, 5,  0, TRUE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (6,  'Durgapur Photographers',    'Capture and share moments in Durgapur',            1, 6,  0, TRUE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (7,  'Durgapur Business Network', 'Networking for entrepreneurs in Durgapur',         1, 7,  0, TRUE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (8,  'Durgapur AI Enthusiasts',   'Exploring artificial intelligence in Durgapur',    1, 8,  0, TRUE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (9,  'Durgapur Travel Club',      'Plan trips and share travel stories from Durgapur', 1, 9,  0, TRUE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (10, 'Durgapur Foodies',          'Food recommendations and recipes from Durgapur',    1, 10, 0, TRUE, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
