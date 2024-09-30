import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

export function setupSwagger(
  app: INestApplication,
) {
  const config = new DocumentBuilder()
    .setTitle('Clash Royale API')
    .setDescription(
      `
      API Clash Royale
  `,
    )
    .addServer('http://localhost:3000', 'Local Server')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
}
