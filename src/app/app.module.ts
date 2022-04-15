import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TribeModule } from '../tribe/tribe.module';

@Module({
  imports: [ConfigModule.forRoot(), TribeModule],
  controllers: [AppController],
})
export class AppModule {}
