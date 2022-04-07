import { Body, Controller, Get, Post } from '@nestjs/common';
import { TribeWebHooksBodyDto, TribeWebHooksResponseDto } from './dtos';

@Controller()
export class AppController {
  @Get()
  sayHello(): string {
    return `For now it's working: ${new Date()}`;
  }

  @Post('tribe-webhook')
  tribeWebhooks(@Body() body: TribeWebHooksBodyDto): TribeWebHooksResponseDto {
    return {
      type: body.type,
      status: 'SUCCEEDED',
      data: body.data,
    };
  }
}
