import { getAdapterFromSource } from "../../adapters/external";
import { EventSource } from "../types";
import * as UpdateService from "../update";
import * as EventSourceService from "../event-source";

export async function pollEventSources() {
  const sources = await EventSourceService.getSourcesDueForPolling();
  for (const source of sources) {
    await processPolledEvents(source);
  }
}

async function processPolledEvents(eventSource: EventSource) {
  const adapter = getAdapterFromSource(eventSource.source);

  const { latestEventDate, events } = await adapter.fetchEvents(
    eventSource.last_checked
  );

  if (events.length > 0) {
    const note = adapter.createNote(events);
    await UpdateService.createUpdate(eventSource.monitor_id, note);
  }

  await EventSourceService.updateLastChecked(eventSource.id, latestEventDate);
}
