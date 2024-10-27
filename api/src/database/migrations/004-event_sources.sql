-- Up
CREATE TABLE IF NOT EXISTS event_sources (
  id TEXT PRIMARY KEY,
  monitor_id TEXT NOT NULL,
  mechanism TEXT NOT NULL CHECK(mechanism IN ('webhook', 'polling')),
  source TEXT NOT NULL,
  frequency INTEGER NOT NULL,
  last_checked DATETIME,

  FOREIGN KEY (monitor_id) REFERENCES monitors(id)
);

INSERT INTO event_sources (id, monitor_id, mechanism, source, frequency, last_checked)
VALUES ('RDi7rdHjeV', '6NiaWOx2gb', 'polling', 'leetcode', 10800000, 1727412532795); -- poll LeetCode every 3 hours

-- Down
DROP TABLE IF EXISTS event_sources;