import { Module } from '@nestjs/common';
import { UpdatesService } from './updates.service';
import { UpdatesController } from './updates.controller';
import { DB as DatabaseProvider } from 'src/database/database';

@Module({
  controllers: [UpdatesController],
  providers: [UpdatesService, DatabaseProvider],
})
export class UpdatesModule {}
