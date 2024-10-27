import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UpdatesService } from './updates.service';
import { CreateUpdateDto } from './dto/create-update.dto';
import { UpdateEntity } from './entities/update.entity';

@UseInterceptors(ClassSerializerInterceptor)
@Controller({ path: 'updates', version: '1' })
export class UpdatesController {
  constructor(private readonly updatesService: UpdatesService) {}

  @Post()
  create(@Body() createUpdateDto: CreateUpdateDto) {
    return this.updatesService.create(createUpdateDto);
  }

  @Get()
  findAll(): Promise<UpdateEntity[]> {
    return this.updatesService.findAll();
  }
}
