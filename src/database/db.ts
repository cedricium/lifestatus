import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";

const DATABASE_URL =
  process.env.DATABASE_URL || path.join(__dirname, "progress.db");

let database: Database | null = null;

(async () => {
  if (process.env.NODE_ENV === "test") return;
  try {
    database = await open({
      filename: DATABASE_URL,
      driver: sqlite3.cached.Database,
    });

    console.log("[db] connected to SQLite database…");
    console.log("[db] running migrations…");
    await database.migrate({
      migrationsPath: path.join(__dirname, "migrations"),
    });
    console.log("[db] successfully set up SQLite database!");
  } catch (err) {
    console.error("[db] error setting up the database!");
    throw err;
  }
})();

export const db = () => {
  if (!database) {
    throw new Error("Database not initialized yet!");
  }
  return database;
};
