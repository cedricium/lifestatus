import { CronJob } from "cron";

import { getCurrentAverageStatus } from "../services/monitor";
import { create } from "../services/snapshot";

export const nightlySnapshot = new CronJob(
  "0 59 23 * * *",
  async () => {
    try {
      const status = await getCurrentAverageStatus();
      const snapshot = await create(status!!);
      console.log("successfully captured snapshot: ", snapshot);
    } catch (err) {
      console.error("failed to capture snapshot: ", err);
    }
  },
  null,
  true,
  "America/Los_Angeles"
);
