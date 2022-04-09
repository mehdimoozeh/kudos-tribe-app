import { Body, Controller, Post } from '@nestjs/common';
import { TribeWebhooksBodyDto, TribeWebhooksHeadersDto } from './dtos';
import { RequestHeader } from '../decorators/request-header.decorator';
import { TribeWebhookService } from './tribe-webhook.service';

@Controller('tribe-webhook')
export class TribeWebhookController {
  constructor(private readonly tribeWebhookService: TribeWebhookService) {}

  @Post()
  tribeWebhooks(
    @Body() body: TribeWebhooksBodyDto,
    @RequestHeader(TribeWebhooksHeadersDto) headers: TribeWebhooksHeadersDto,
  ) {
    this.tribeWebhookService.handleWebhookRequest(body);
    return true;
  }
}
