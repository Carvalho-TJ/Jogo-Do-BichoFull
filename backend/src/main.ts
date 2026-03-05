import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Permite que o Front acesse o Back
  app.enableCors();

  await app.listen(3000);
  console.log('🚀 Backend rodando em http://localhost:3000');
}
bootstrap();
