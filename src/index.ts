import app from "./app";
import { db } from "./database/db";
import { nightlySnapshot } from "./jobs/snapshot";

const PORT = process.env.PORT || 3000;
const { API_KEY } = process.env;
if (!API_KEY) {
  throw new Error(
    "[env] missing `API_KEY` - did you forget to add it to .env?"
  );
}

const server = app
  .listen(PORT, () => {
    console.log(`🟢 server running on PORT: ${PORT}`);
  })
  .on("error", (error) => {
    console.error(`⛔️ ${error.message}`);
  });

process.on("SIGTERM", async () => {
  nightlySnapshot.stop();
  await db().close();
  server.close();
});
