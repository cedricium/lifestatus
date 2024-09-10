import Sqids from "sqids";

import { db } from "../database/db";
import { Monitor, Status, StatusRange, Update } from "./types";

const sqids = new Sqids({ minLength: 8 });
const MONITOR_ENTITY_KEY = 1;

export async function getMonitors(): Promise<Monitor[]> {
  const sql = `SELECT * FROM monitors ORDER BY status DESC`;
  return await db().all(sql);
}

export async function getMonitorById(id: string): Promise<Monitor> {
  const sql = `SELECT * FROM monitors WHERE id = ?`;
  return await db().all(sql, id);
}

export async function createMonitor(
  data: Partial<Monitor>
): Promise<Monitor | undefined> {
  const { title, description, period, frequency } = data;
  const id = sqids.encode([Date.now(), MONITOR_ENTITY_KEY]);
  let sql = `INSERT INTO monitors(id, title, description, created_at, last_update_at, status`;
  let params = [id, title, description || null, new Date(), null, 0.0];

  if (period) {
    sql += `, period`;
    params.push(period);
  }
  if (frequency) {
    sql += `, frequency`;
    params.push(frequency);
  }

  sql += `) VALUES(${params.map(() => "?").join(", ")}) RETURNING *`;

  return await db().get(sql, params);
}

export async function getCurrentAggregateStatus(): Promise<Status | undefined> {
  const sql = `SELECT AVG(status) AS avg FROM monitors WHERE status > 0.0`;
  const result = await db().get(sql);
  return getStatusFromAverage(result.avg);
}

export async function updateMonitorStatus(monitorId: string) {
  const monitor = await db().get(
    "SELECT * FROM monitors WHERE id = ?",
    monitorId
  );
  const updates = await db().all(
    "SELECT * FROM updates WHERE monitor_id = ?",
    // TODO: `WHERE timestamp >= Date.now() - (2 * periodInMS)`
    monitorId
  );

  const status = calculateStatus(monitor, updates);
  if (status !== monitor.status) {
    await db().run(
      `UPDATE monitors SET status = ? WHERE id = ?`,
      status,
      monitorId
    );
  }
}

const STATUSES = {
  GETTING_STARTED: 0.0,
  UNFOCUSED: 0.1,
  REFOCUSING: 0.75,
  MAKING_PROGRESS: 1.0,
};

export const STATUS_RANGES: StatusRange[] = [
  { min: -Infinity, max: 0.0, label: "Getting Started", color: "#FFC5E9" },
  { min: 0.01, max: 0.49, label: "Unfocused", color: "#E95858" },
  { min: 0.5, max: 0.75, label: "Refocusing", color: "#FFAF36" },
  { min: 0.76, max: 1.0, label: "Making Progress", color: "#2BAC76" },
];

// TODO: rename to e.g. getStatusFromProgress(progress: number): Status {
// given `progress` is all-encompassing of both aggregate and individual monitors health
export function getStatusFromAverage(avg: number): Status {
  const range = STATUS_RANGES.find(
    (range) => avg >= range.min && avg <= range.max
  );
  if (!range) {
    throw new Error(`Invalid average: ${avg}`);
  }
  return {
    value: avg,
    label: range.label,
    color: range.color,
  };
}

function hoursToMs(hours: number): number {
  return hours * 60 * 60 * 1000;
}

export function calculateStatus(monitor: Monitor, updates: Update[]): number {
  const periodInMs = hoursToMs(monitor.period);

  const recentUpdates = updates.filter(
    (update) => update.timestamp >= Date.now() - periodInMs
  );

  if (recentUpdates.length >= monitor.frequency)
    return STATUSES.MAKING_PROGRESS;

  const isFirstPeriod =
    !monitor.last_update_at && Date.now() < monitor.created_at + periodInMs;
  if (isFirstPeriod) return STATUSES.GETTING_STARTED;

  const pastPeriodUpdates = updates.filter(
    (update) =>
      update.timestamp <= monitor.last_update_at! &&
      update.timestamp >= monitor.last_update_at! - periodInMs
  );

  if (pastPeriodUpdates.length >= monitor.frequency) return STATUSES.REFOCUSING;
  return STATUSES.UNFOCUSED;
}
