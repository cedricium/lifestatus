import { Module } from '@nestjs/common';
import { MonitorsService } from './monitors.service';
import { MonitorsController } from './monitors.controller';
import { DB as DatabaseProvider } from 'src/database/database';

@Module({
  controllers: [MonitorsController],
  providers: [MonitorsService, DatabaseProvider],
})
export class MonitorsModule {}
