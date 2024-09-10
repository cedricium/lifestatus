import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";

const DATABASE_URL = process.env.DATABASE_URL || "progress.db";

let database: Database | null = null;

(async () => {
  if (process.env.NODE_ENV === "test") return;
  try {
    database = await open({
      filename: DATABASE_URL,
      driver: sqlite3.cached.Database,
    });

    console.log("[db] connected to SQLite database…");

    const sql = fs.readFileSync(path.join(__dirname, "setup.sql"), "utf8");
    await database.exec(sql);
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
