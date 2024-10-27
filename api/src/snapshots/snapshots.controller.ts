import { Controller, Get } from '@nestjs/common';
import { SnapshotsService } from './snapshots.service';

@Controller({ path: 'snapshots', version: '1' })
export class SnapshotsController {
  constructor(private readonly snapshotsService: SnapshotsService) {}

  @Get()
  findAll() {
    return this.snapshotsService.findAll();
  }
}
