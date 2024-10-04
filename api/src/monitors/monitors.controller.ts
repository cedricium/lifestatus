import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { MonitorsService } from './monitors.service';
import { CreateMonitorDto } from './dto/create-monitor.dto';
import { UpdateMonitorDto } from './dto/update-monitor.dto';

@Controller({ path: 'monitors', version: '1' })
export class MonitorsController {
  constructor(private readonly monitorsService: MonitorsService) {}

  @Post()
  create(@Body() createMonitorDto: CreateMonitorDto) {
    return this.monitorsService.create(createMonitorDto);
  }

  @Get()
  findAll() {
    return this.monitorsService.findAll();
  }

  @Get('/status')
  getAverageStatus() {
    return this.monitorsService.getAverageStatus();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMonitorDto: UpdateMonitorDto) {
    return this.monitorsService.update(+id, updateMonitorDto);
  }
}
