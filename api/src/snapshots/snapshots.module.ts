import { Module } from '@nestjs/common';
import { SnapshotsService } from './snapshots.service';
import { SnapshotsController } from './snapshots.controller';
import { DB as DatabaseProvider } from 'src/database/database';

@Module({
  controllers: [SnapshotsController],
  providers: [SnapshotsService, DatabaseProvider],
})
export class SnapshotsModule {}
