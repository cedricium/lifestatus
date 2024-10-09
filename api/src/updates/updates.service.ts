import { Injectable } from '@nestjs/common';
import { DB as DatabaseProvider } from 'src/database/database';
import { CreateUpdateDto } from './dto/create-update.dto';
import { UpdateEntity } from './entities/update.entity';

@Injectable()
export class UpdatesService {
  constructor(private databaseProvider: DatabaseProvider) {}

  create(createUpdateDto: CreateUpdateDto) {
    return 'This action adds a new update';
  }

  async findAll() {
    const sql = `
      SELECT updates.*, monitors.title AS monitor
      FROM updates
      LEFT JOIN monitors ON updates.monitor_id = monitors.id
      ORDER BY timestamp DESC
      LIMIT 10;
    `;
    const result = await this.databaseProvider.db.all(sql);
    return result.map((u) => new UpdateEntity(u));
  }
}
