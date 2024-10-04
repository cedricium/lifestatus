import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthcheckModule } from './healthcheck/healthcheck.module';
import { MonitorsModule } from './monitors/monitors.module';
import { UpdatesModule } from './updates/updates.module';
import { SnapshotsModule } from './snapshots/snapshots.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [HealthcheckModule, MonitorsModule, UpdatesModule, SnapshotsModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
