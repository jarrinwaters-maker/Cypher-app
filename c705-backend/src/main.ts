import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for iOS app and other clients
  app.enableCors({
    origin: true, // Allow all origins (for development)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe());
  
  // Listen on all network interfaces (0.0.0.0) so iOS devices can connect
  // This allows connections from both localhost and other devices on the network
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server is running on: http://0.0.0.0:${port}`);
  console.log(`   Local access: http://localhost:${port}`);
  console.log(`   Network access: http://10.0.0.215:${port}`);
}
bootstrap();
