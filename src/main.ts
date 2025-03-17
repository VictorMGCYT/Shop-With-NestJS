import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main');

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,

      // ! No mostrar los campos undefined
      transformOptions: {
        exposeUnsetFields: false
      }
    })
   );

  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Server is running on port: ${process.env.PORT ?? 3000}`)
}
bootstrap();
