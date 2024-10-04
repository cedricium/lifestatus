import { Injectable } from '@nestjs/common';
import { CreateUpdateDto } from './dto/create-update.dto';

@Injectable()
export class UpdatesService {
  create(createUpdateDto: CreateUpdateDto) {
    return 'This action adds a new update';
  }

  findAll() {
    return `This action returns all updates`;
  }
}
