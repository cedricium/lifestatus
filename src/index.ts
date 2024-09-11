import app from "./app";
import { db } from "./database/db";

const PORT = process.env.PORT || 3000;

const server = app
  .listen(PORT, () => {
    console.log(`🟢 server running on PORT: ${PORT}`);
  })
  .on("error", (error) => {
    console.error(`⛔️ ${error.message}`);
  });

process.on("SIGTERM", async () => {
  await db().close();
  server.close();
});
