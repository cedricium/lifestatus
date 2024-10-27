import { Injectable } from '@nestjs/common';
import { DB as DatabaseProvider } from 'src/database/database';
import { CreateSnapshotDto } from './dto/create-snapshot.dto';

@Injectable()
export class SnapshotsService {
  constructor(private databaseProvider: DatabaseProvider) {}

  findAll() {
    const limit = 60;
    const sql = `
      SELECT *
      FROM snapshots
      WHERE created_at >= date('now', '-${limit} days')
      ORDER BY created_at ASC
      LIMIT ${limit};
    `;
    return this.databaseProvider.db.all(sql);
  }

  create(createSnapshotDto: CreateSnapshotDto) {
    return 'This action adds a new snapshot';
  }
}
