import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('EXAMPLE_PATTERN')
  async handleJackpotsUpdate(@Payload() data: any): Promise<void> {
    console.log(`EXAMPLE_PATTERN DATA: ${JSON.stringify(data)}`);
  }
}
