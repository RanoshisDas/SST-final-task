import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {LoggingInterceptor} from "./interceptors/logging.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    app.useGlobalInterceptors(new LoggingInterceptor());
    const config = new DocumentBuilder()
        .setTitle('ToDo List API')
        .setDescription('API documentation for the ToDo List project')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Auth')
        .addTag('Tasks')
        .addTag('Users')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
