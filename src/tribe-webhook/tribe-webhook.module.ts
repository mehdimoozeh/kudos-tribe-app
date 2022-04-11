import { Module } from '@nestjs/common';
import { TribeWebhookService } from './tribe-webhook.service';
import { TribeWebhookController } from './tribe-webhook.controller';
import { DatabaseService } from './database.service';

@Module({
  providers: [TribeWebhookService, DatabaseService],
  controllers: [TribeWebhookController],
  exports: [DatabaseService],
})
export class TribeWebhookModule {}
