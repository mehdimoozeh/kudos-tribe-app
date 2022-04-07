import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { TribeWebHooksBodyDto, TribeWebHooksResponseDto } from './dtos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
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
