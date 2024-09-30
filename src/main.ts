import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  setupSwagger(app);

  await app.listen(3000);

  console.info(
    `Swagger configurado com sucesso!, acesse o endpoint: /docs`,
  ); 
}

// Start server
bootstrap().catch((err) => console.error('Erro ao iniciar servidor: ' + err));
