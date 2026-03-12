import {Body, Controller, Get, Post, Session, UseGuards} from '@nestjs/common';
import {CreateUserDto} from "../dtos/create-user.dto";
import {AuthService} from "./auth.service";
import {Serialize} from "../interceptors/serialize.interceptor";
import {UserDto} from "../dtos/user.dto";
import {CurrentUser} from "../decorators/current-user.decorator";
import {LoginUserDto} from "../dtos/login-user.dto";
import {JwtAuthGuard} from "../guard/jwt.guard";
import {ApiBearerAuth} from "@nestjs/swagger";

@Controller('auth')
// @Serialize(UserDto)
export class AuthController {
    constructor(private authService:AuthService) {
    }

    @Post('login')
    async login(@Body() body: LoginUserDto,@Session() session:any) {
        const user=await this.authService.signIn(body.email, body.password)
        session.userId=user.userId;
        return user;
    }
    @Post('register')
    async register(@Body() body: CreateUserDto, @Session() session:any) {
        const user=await this.authService.createUser(body)
        session.userId=user.userId;
        return user;
    }

    @Post('logout')
    logout(@Session() session:any){
        session.userId = null;
        return { message: "Logged out successfully" };
    }

    @Serialize(UserDto)
    @Get('whoami')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    whoAmI(@CurrentUser()user:UserDto){
        return user;
    }


}
