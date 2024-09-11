import Sqids from "sqids";

import { db } from "../database/db";
import { Monitor, Status, StatusRange } from "./types";
import { getAverageMonitorStatus, listMonitorsWithStatus } from "./monitor.sql";

const sqids = new Sqids({ minLength: 8 });
const MONITOR_ENTITY_KEY = 1;

export async function getMonitors(): Promise<Monitor[]> {
  const monitors = await db().all(listMonitorsWithStatus);
  return monitors.map((monitor) => ({
    ...monitor,
    status: getStatusRangeFromProgress(monitor.status),
  }));
}

export async function getCurrentAverageStatus(): Promise<Status | undefined> {
  const result = await db().get(getAverageMonitorStatus);
  return getStatusRangeFromProgress(result.avg);
}

export async function createMonitor(
  data: Partial<Monitor>
): Promise<Monitor | undefined> {
  const { title, description, period, frequency } = data;
  const id = sqids.encode([Date.now(), MONITOR_ENTITY_KEY]);
  let sql = `INSERT INTO monitors(id, title, description, created_at`;
  let params: (string | Date | number | null | undefined)[] = [
    id,
    title,
    description || null,
    new Date(),
  ];

  if (period) {
    sql += `, period`;
    params.push(period);
  }
  if (frequency) {
    sql += `, frequency`;
    params.push(frequency);
  }

  sql += `) VALUES(${params.map(() => "?").join(", ")}) RETURNING *`;

  // TODO: won't return dynamic `status`—may want to pass to `getMonitorById` function
  return await db().get(sql, params);
}

export const STATUS_RANGES: StatusRange[] = [
  { min: -Infinity, max: 0.0, label: "Getting Started", color: "#FFC5E9" },
  { min: 0.01, max: 0.49, label: "Unfocused", color: "#E95858" },
  { min: 0.5, max: 0.75, label: "Refocusing", color: "#FFAF36" },
  { min: 0.76, max: 1.0, label: "Making Progress", color: "#2BAC76" },
];

export function getStatusRangeFromProgress(progress: number): Status {
  const range = STATUS_RANGES.find(
    (range) => progress >= range.min && progress <= range.max
  );
  if (!range) {
    throw new Error(`Invalid average: ${progress}`);
  }
  return {
    value: progress,
    label: range.label,
    color: range.color,
  };
}
