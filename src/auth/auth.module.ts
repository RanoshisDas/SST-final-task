import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UsersModule} from "../users/users.module";
import {JwtStrategy} from "../jwt.strategy";

@Module({
imports: [UsersModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
