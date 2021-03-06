import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      skipMissingProperties: true,
      enableDebugMessages: configService.get('NODE_ENV') !== 'production',
    }),
  );
  const PORT = +configService.get('PORT');
  const logger = new Logger();
  await app.listen(PORT, () => {
    logger.log(`Listening on port ${PORT}`);
  });
}
bootstrap();
