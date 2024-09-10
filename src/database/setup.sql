CREATE TABLE IF NOT EXISTS monitors (
  id TEXT PRIMARY KEY,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  title TEXT UNIQUE NOT NULL,
  description TEXT,
  period INTEGER DEFAULT 24 NOT NULL,
  frequency INTEGER DEFAULT 1 NOT NULL,
  last_update_at DATETIME,
  status REAL CHECK(status >= 0.0 AND status <= 1.0)
);

CREATE TABLE IF NOT EXISTS updates (
  id TEXT PRIMARY KEY,
  monitor_id TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,

  FOREIGN KEY (monitor_id) REFERENCES monitors(id)
);

CREATE INDEX IF NOT EXISTS idx_updates_monitor_id_timestamp ON updates(monitor_id, timestamp);