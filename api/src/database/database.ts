import * as path from 'path';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Database as SQLiteDatabase, cached } from 'sqlite3';
import { type Database, open } from 'sqlite';

const DATABASE_URL =
  process.env.DATABASE_URL || path.join(__dirname, 'progress.db');

@Injectable()
export class DB implements OnModuleInit, OnModuleDestroy {
  private _db: Database<SQLiteDatabase>;

  constructor() {}

  async onModuleInit() {
    try {
      const database = await open({
        filename: DATABASE_URL,
        driver: cached.Database,
      });

      await database.migrate({
        migrationsPath: path.join(__dirname, 'migrations'),
      });

      this._db = database;
    } catch (error) {
      throw error;
    }
  }

  async onModuleDestroy() {
    this._db.close();
  }

  public get db(): Database<SQLiteDatabase> {
    if (!this._db) {
      throw new Error('Database not yet initialized!');
    }
    return this._db;
  }
}
