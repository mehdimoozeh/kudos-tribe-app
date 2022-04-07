import { Module } from '@nestjs/common';
import { TribeWebhookService } from './tribe-webhook.service';
import { TribeWebhookController } from './tribe-webhook.controller';

@Module({
  providers: [TribeWebhookService],
  controllers: [TribeWebhookController]
})
export class TribeWebhookModule {}
