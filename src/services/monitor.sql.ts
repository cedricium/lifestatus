const baseQuery = `WITH recent_updates AS (
  SELECT 
      m.id AS monitor_id,
      MAX(u.timestamp) AS last_update_at,
      COUNT(u.id) AS recent_update_count,
      COUNT(CASE WHEN u.timestamp >= (strftime('%s', 'now') * 1000) - (m.period * 3600000) THEN 1 END) AS current_period_count,
      COUNT(CASE WHEN u.timestamp < (strftime('%s', 'now') * 1000) - (m.period * 3600000) AND u.timestamp >= (strftime('%s', 'now') * 1000) - (2 * m.period * 3600000) THEN 1 END) AS past_period_count
  FROM monitors m
  LEFT JOIN updates u ON m.id = u.monitor_id
  GROUP BY m.id
)`;

export const listMonitorsWithStatus = `${baseQuery}
SELECT
    m.*,
    r.last_update_at AS last_update_at,
    CASE
        -- First period, not enough updates
        WHEN (strftime('%s', 'now') * 1000) < (m.created_at + m.period * 3600000) AND recent_update_count < m.frequency THEN 0.0
        -- Enough updates in current period
        WHEN current_period_count >= m.frequency THEN 1.0
        -- Not enough updates in current period but enough in past period
        WHEN current_period_count < m.frequency AND past_period_count >= m.frequency THEN 0.75
        -- No recent or past updates
        ELSE 0.1
    END AS status
FROM monitors m
LEFT JOIN recent_updates r ON m.id = r.monitor_id
ORDER BY status DESC`;

export const getAverageMonitorStatus = `${baseQuery}
, statuses AS (
    SELECT
      m.*,
      CASE
          -- First period, not enough updates
          WHEN (strftime('%s', 'now') * 1000) < (m.created_at + m.period * 3600000) AND recent_update_count < m.frequency THEN 0.0
          -- Enough updates in current period
          WHEN current_period_count >= m.frequency THEN 1.0
          -- Not enough updates in current period but enough in past period
          WHEN current_period_count < m.frequency AND past_period_count >= m.frequency THEN 0.75
          -- No recent or past updates
          ELSE 0.1
      END AS status
  FROM monitors m
  LEFT JOIN recent_updates r ON m.id = r.monitor_id)
SELECT AVG(status) as avg FROM statuses WHERE status > 0.0`;
