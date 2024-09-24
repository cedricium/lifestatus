import { CronJob } from "cron";
import { pollEventSources } from "../services/events/processor";

export const eventSourcePolling = new CronJob(
  "0 */30 * * * *",
  async () => {
    console.log(new Date().toISOString(), `running event source polling…`);
    await pollEventSources();
  },
  null,
  true,
  "America/Los_Angeles"
);
