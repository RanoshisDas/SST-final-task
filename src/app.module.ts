import {MiddlewareConsumer, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import cookieSession from "cookie-session";
import {ConfigModule,ConfigService} from "@nestjs/config";
import { AuthModule } from './auth/auth.module';
import {AppDataSource} from './data-source';
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./jwt.strategy";

@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: `.env.${process.env.NODE_ENV}`
      }),
      TypeOrmModule.forRoot(AppDataSource.options)
      ,UsersModule, TasksModule, AuthModule,
      JwtModule.register({global:true,secret:process.env.JWT_SECRET}),
  ],
  controllers: [AppController],
  providers: [AppService,JwtStrategy],
})
export class AppModule {
    constructor(private configService: ConfigService){}
    configure(consumer:MiddlewareConsumer){
        consumer.apply(
            cookieSession({
                keys:[this.configService.get('COOKIE_KEY','key-for-cookie')],
            }),
        ).forRoutes('*');
    }
}
