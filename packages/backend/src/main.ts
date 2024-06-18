import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
const port: number = Number.parseInt(process.env.ONYXYA_API_PORT) | 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS's configuration
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  };
  app.enableCors(corsOptions);

  await app.listen(port);
}

bootstrap();
