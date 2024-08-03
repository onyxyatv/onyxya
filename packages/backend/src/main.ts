import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const port: number = Number.parseInt(process.env.ONYXYA_API_PORT) | 3000;
const frontIp: string = process.env.ONYXYA_FRONT_IP;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS's configuration
  const corsOptions: CorsOptions = {
    origin: ['http://localhost:5173', `http://${frontIp}:5173`],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTION',
    allowedHeaders:
      'Content-Type, Accept, Authorization, X-Requested-With, Origin',
    credentials: true,
  };

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors(corsOptions);

  await app.listen(port);
}

bootstrap();
