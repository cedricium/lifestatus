import { db } from "../database/db";
import { EventSource } from "./types";

export async function getById(id: string): Promise<EventSource | undefined> {
  return db().get("SELECT * FROM event_sources WHERE id = ?", id);
}

// TODO: hook up with form in admin page
// export async function create() {}

export async function getSourcesDueForPolling(): Promise<EventSource[]> {
  const sources = await db().all(
    'SELECT * FROM event_sources WHERE mechanism = "polling"'
  );
  return sources.filter(
    (source) => Date.now() - source.last_checked >= source.frequency
  );
}

export async function updateLastChecked(
  id: string,
  lastChecked: Date
): Promise<void> {
  await db().run("UPDATE event_sources SET last_checked = ? WHERE id = ?", [
    lastChecked,
    id,
  ]);
}
