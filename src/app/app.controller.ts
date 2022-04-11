import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  sayHello(): string {
    return `For now it's working: ${new Date()}`;
  }
}
