import Sqids from "sqids";

import { db } from "../database/db";
import { Snapshot, Status } from "./types";

const sqids = new Sqids({ minLength: 8 });
const SNAPSHOT_ENTITY_KEY = 3;

export async function findAll(limit: number = 60): Promise<Snapshot[]> {
  const sql = `
    SELECT created_at, value, color
    FROM snapshots
    WHERE created_at >= date('now', '-${limit} days')
    ORDER BY created_at ASC
    LIMIT ${limit};
  `;
  return await db().all(sql);
}

export async function create(status: Status): Promise<Snapshot | undefined> {
  const { value, label, color } = status;
  const id = sqids.encode([Date.now(), SNAPSHOT_ENTITY_KEY]);

  let sql = `INSERT INTO snapshots(id, created_at, value, label, color) VALUES(?, ?, ?, ?, ?) RETURNING *`;
  let params = [id, new Date(), value, label, color];

  return await db().get(sql, params);
}
