import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "./user.entity";
import { UsersService } from './users.service';
import {CurrentUserMiddleware} from '../middlewares/current-user.middleware'

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
  controllers: [UsersController],
  providers: [UsersService],
    exports:[UsersService]
})
export class UsersModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CurrentUserMiddleware)
            .forRoutes('*');

        // consumer.apply(LoggerMiddleware).forRoutes("*")
    }
}
