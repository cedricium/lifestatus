import Sqids from "sqids";

import { db } from "../database/db";
import { Snapshot, Status } from "./types";

const sqids = new Sqids({ minLength: 8 });
const SNAPSHOT_ENTITY_KEY = 3;

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export async function getSnapshots() {
  const sql = `
    SELECT created_at, value, color
    FROM snapshots
    WHERE created_at >= date('now', '-60 days')
    ORDER BY created_at ASC
    LIMIT 60;
  `;
  const snapshots = await db().all(sql);

  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 30); // 60 days ago

  const result = [];
  const dataMap = new Map(
    snapshots.map((row) => [formatDate(new Date(row.created_at)), row])
  );

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = formatDate(d);
    const dataForDate = dataMap.get(dateStr);

    if (dataForDate) {
      result.push({
        date: dateStr,
        avg: Math.round(dataForDate.value * 100),
        fill: dataForDate.color,
      });
    } else {
      result.push({
        date: dateStr,
        avg: null,
        fill: null,
      });
    }
  }

  return result;
}

export async function createSnapshot(
  status: Status
): Promise<Snapshot | undefined> {
  const { value, label, color } = status;
  const id = sqids.encode([Date.now(), SNAPSHOT_ENTITY_KEY]);

  let sql = `INSERT INTO snapshots(id, value, label, color) VALUES(?, ?, ?, ?) RETURNING *`;
  let params = [id, value, label, color];

  return await db().get(sql, params);
}
