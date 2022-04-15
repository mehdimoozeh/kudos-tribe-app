import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TribeModule } from '../tribe/tribe.module';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot(), TribeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
