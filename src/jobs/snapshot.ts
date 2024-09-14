import { CronJob } from "cron";

import { getCurrentAverageStatus } from "../services/monitor";
import { createSnapshot } from "../services/snapshot";

export const nightlySnapshot = new CronJob(
  "0 0 * * * *",
  async () => {
    const status = await getCurrentAverageStatus();
    const snapshot = await createSnapshot(status!!);
    console.log("successfully captured snapshot: ", snapshot);
  },
  null,
  true,
  "America/Los_Angeles"
);
