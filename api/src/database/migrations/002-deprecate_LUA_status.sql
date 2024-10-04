-- Up
ALTER TABLE monitors DROP COLUMN last_update_at;
ALTER TABLE monitors DROP COLUMN status;

-- Down
ALTER TABLE monitors ADD COLUMN last_update_at DATETIME;
ALTER TABLE monitors ADD COLUMN status REAL CHECK(status >= 0.0 AND status <= 1.0);