import { Module } from '@nestjs/common';
import { DB } from './database';

@Module({
  providers: [DB],
  exports: [DB],
})
export class DatabaseModule {}
