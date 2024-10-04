import { Controller, Get, Post, Body } from '@nestjs/common';
import { UpdatesService } from './updates.service';
import { CreateUpdateDto } from './dto/create-update.dto';

@Controller({ path: 'updates', version: '1' })
export class UpdatesController {
  constructor(private readonly updatesService: UpdatesService) {}

  @Post()
  create(@Body() createUpdateDto: CreateUpdateDto) {
    return this.updatesService.create(createUpdateDto);
  }

  @Get()
  findAll() {
    return this.updatesService.findAll();
  }
}
