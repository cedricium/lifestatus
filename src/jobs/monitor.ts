import { CronJob } from "cron";

import * as monitorService from "../services/monitor";

export const refreshStatuses = new CronJob(
  "0 0 * * * *",
  async function () {
    try {
      const monitors = await monitorService.getMonitors();
      for await (const monitor of monitors) {
        await monitorService.updateMonitorStatus(monitor.id);
      }
      console.log(
        `[cron] ${new Date().toISOString()} - updated monitor statuses`
      );
    } catch (err) {
      console.error(
        `[cron] ${new Date().toISOString()} - error updating monitor statues`,
        err
      );
    }
  },
  null,
  true,
  "America/Los_Angeles"
);
