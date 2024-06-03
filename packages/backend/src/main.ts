import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const port: number = Number.parseInt(process.env.ONYXYA_API_PORT) | 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
}

bootstrap();
