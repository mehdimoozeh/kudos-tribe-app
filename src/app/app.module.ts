import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TribeWebhookModule } from '../tribe-webhook/tribe-webhook.module';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot(), TribeWebhookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
