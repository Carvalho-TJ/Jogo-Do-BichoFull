import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('BichoFull API')
    .setDescription('Documentação das rotas do sistema de apostas BichoFull')
    .setVersion('1.0')
    .addBearerAuth() // Isso permite testar rotas protegidas por JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Permite que o Front acesse o Back
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
  console.log('🚀 Backend rodando em http://localhost:3000');
}
void bootstrap();
