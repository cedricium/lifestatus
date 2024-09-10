import app from "./app";
import { db } from "./database/db";
import { refreshStatuses } from "./jobs/monitor";

const PORT = process.env.PORT || 3000;

const server = app
  .listen(PORT, () => {
    console.log(`🟢 server running on PORT: ${PORT}`);
  })
  .on("error", (error) => {
    console.error(`⛔️ ${error.message}`);
  });

process.on("SIGTERM", async () => {
  refreshStatuses.stop();
  await db().close();
  server.close();
});
