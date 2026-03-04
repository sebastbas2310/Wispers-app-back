import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // habilita validaciones automáticas de DTOs
  app.useGlobalPipes(new (await import('@nestjs/common')).ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // ¡Aquí sucede la magia!
  app.enableCors({
    origin: 'https://wispers-app.vercel.app', // Tu frontend en Vercel
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();