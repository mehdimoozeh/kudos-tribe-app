import { Body, Controller, Post } from '@nestjs/common';
import { TribeWebhooksBodyDto } from './dtos';

@Controller('tribe-webhook')
export class TribeWebhookController {
  @Post()
  tribeWebhooks(@Body() body: TribeWebhooksBodyDto) {
    console.log(body);
  }
}
