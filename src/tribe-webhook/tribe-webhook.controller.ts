import { Body, Controller, Post } from '@nestjs/common';
import { TribeWebhooksBodyDto, TribeWebhooksHeadersDto } from './dtos';
import { RequestHeader } from '../decorators/request-header.decorator';
import { TribeWebhookService } from './tribe-webhook.service';
import { WebhookEventName } from './constants';

@Controller('tribe-webhook')
export class TribeWebhookController {
  constructor(private readonly tribeWebhookService: TribeWebhookService) {}

  @Post()
  tribeWebhooks(
    @Body() body: TribeWebhooksBodyDto,
    @RequestHeader(TribeWebhooksHeadersDto) headers: TribeWebhooksHeadersDto,
  ): { status: string } {
    // Validation should block this kind of behaviour. It is just for test purpose!
    // body?.data?.name
    switch (body?.data?.name) {
      case WebhookEventName.PostPublished:
        this.tribeWebhookService.checkNewPost(body);
        break;
      case WebhookEventName.MemberCreated:
        this.tribeWebhookService.newMember(body);
        break;
    }
    console.log(body);
    return { status: 'SUCCEEDED' };
  }
}
