ALTER TABLE users ADD COLUMN username VARCHAR(50) NULL;
ALTER TABLE users ADD COLUMN password_hash VARCHAR(255) NULL;
CREATE UNIQUE INDEX uk_users_username ON users (username);
