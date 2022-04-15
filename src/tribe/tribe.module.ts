import { Module } from '@nestjs/common';
import { TribeWebhookService } from './tribe-webhook.service';
import { TribeWebhookController } from './tribe-webhook.controller';
import { DatabaseService } from './database.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TribeApiService } from './tribe-api.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule],
  providers: [TribeWebhookService, DatabaseService, TribeApiService],
  controllers: [TribeWebhookController],
  exports: [DatabaseService],
})
export class TribeModule {}
