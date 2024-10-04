import { Injectable } from '@nestjs/common';
import { DB as DatabaseProvider } from 'src/database/database';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';

const recentUpdatesCTE = `WITH recent_updates AS (
  SELECT
      m.id AS monitor_id,
      MAX(u.timestamp) AS last_update_at,
      COUNT(u.id) AS recent_update_count,
      COUNT(CASE WHEN u.timestamp >= (unixepoch('now') * 1000) - (m.period * 3600000) THEN 1 END) AS current_period_count,
      COUNT(CASE WHEN u.timestamp < (unixepoch('now') * 1000) - (m.period * 3600000) AND u.timestamp >= (unixepoch('now') * 1000) - (2 * m.period * 3600000) THEN 1 END) AS past_period_count
  FROM monitors m
  LEFT JOIN updates u ON m.id = u.monitor_id
  GROUP BY m.id)`;

const calculateStatus = `SELECT
  m.*,
  r.last_update_at AS last_update_at,
  CASE
      -- First period, not enough updates
      WHEN (unixepoch('now') * 1000) < (m.created_at + m.period * 3600000) AND recent_update_count < m.frequency THEN 0.0
      -- Enough updates in current period
      WHEN current_period_count >= m.frequency THEN 1.0
      -- Not enough updates in current period but enough in past period
      WHEN current_period_count < m.frequency AND current_period_count + past_period_count >= m.frequency THEN 0.75
      -- No recent or past updates
      ELSE 0.1
  END AS status
FROM monitors m
LEFT JOIN recent_updates r ON m.id = r.monitor_id`;

const listMonitorsWithStatus = `${recentUpdatesCTE}
${calculateStatus}
ORDER BY status DESC`;

@Injectable()
export class MonitorsService {
  constructor(private databaseProvider: DatabaseProvider) {}

  create(createMonitorDto: CreateMonitorDto) {
    return 'This action adds a new monitor';
  }

  async findAll() {
    const result = await this.databaseProvider.db.all(listMonitorsWithStatus);
    return result;
  }

  getAverageStatus() {
    return `This action computes the average status of all active monitors`;
  }

  update(id: number, updateMonitorDto: UpdateMonitorDto) {
    return `This action updates a ${id} monitor`;
  }
}
