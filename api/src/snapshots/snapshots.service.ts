import { Injectable } from '@nestjs/common';
import { CreateSnapshotDto } from './dto/create-snapshot.dto';

@Injectable()
export class SnapshotsService {
  findAll() {
    return `This action returns all snapshots`;
  }

  create(createSnapshotDto: CreateSnapshotDto) {
    return 'This action adds a new snapshot';
  }
}
