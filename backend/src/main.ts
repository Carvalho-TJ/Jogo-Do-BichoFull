import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Permite que o Front acesse o Back
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(3000);
  console.log('🚀 Backend rodando em http://localhost:3000');
}
void bootstrap();
