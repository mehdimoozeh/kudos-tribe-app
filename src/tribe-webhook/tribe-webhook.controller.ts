import { Body, Controller, Post } from '@nestjs/common';
import { TribeWebhooksBodyDto, TribeWebhooksHeadersDto } from './dtos';
import { RequestHeader } from '../decorators/request-header.decorator';

@Controller('tribe-webhook')
export class TribeWebhookController {
  @Post()
  tribeWebhooks(
    @Body() body: TribeWebhooksBodyDto,
    @RequestHeader(TribeWebhooksHeadersDto) headers: TribeWebhooksHeadersDto,
  ) {
    console.log(headers);
    // console.log(body);
  }
}
