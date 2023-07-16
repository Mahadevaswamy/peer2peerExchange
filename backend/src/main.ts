import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('P2P Crypto Trading ')
    .setDescription('A Platform for sellers and buyers to connect directly')
    .setVersion('beta')
    .addTag('Blockchain')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.enableCors();
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();