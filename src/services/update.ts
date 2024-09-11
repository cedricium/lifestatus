import Sqids from "sqids";

import { db } from "../database/db";
import { Update } from "./types";

const sqids = new Sqids({ minLength: 8 });
const UPDATE_ENTITY_KEY = 2;

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
