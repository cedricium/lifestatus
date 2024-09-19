import Sqids from "sqids";

import { db } from "../database/db";
import { Update } from "./types";

const sqids = new Sqids({ minLength: 8 });
const UPDATE_ENTITY_KEY = 2;

export async function findAll(limit: number = 10): Promise<Update[]> {
  const sql = `
    SELECT updates.*, monitors.title AS monitor
    FROM updates
    LEFT JOIN monitors ON updates.monitor_id = monitors.id
    ORDER BY timestamp DESC
    LIMIT ${limit};
  `;
  return await db().all(sql);
}

export async function createUpdate(
  monitorId: string,
  notes?: string
): Promise<Update | undefined> {
  const updateId = sqids.encode([Date.now(), UPDATE_ENTITY_KEY]);
  const timestamp = new Date();

  const params = [updateId, monitorId, timestamp, notes || null];
  const sql = `INSERT INTO updates(id, monitor_id, timestamp, notes) VALUES(${params
    .map(() => "?")
    .join(", ")}) RETURNING *`;

  return await db().get(sql, params);
}
