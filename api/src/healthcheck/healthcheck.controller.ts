import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'healthz', version: '1' })
export class HealthcheckController {
  @Get()
  checkHealth(): { ts: number } {
    return { ts: Date.now() };
  }
}
