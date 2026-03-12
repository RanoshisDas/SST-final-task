import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch, Query,
    Session,
    UseGuards
} from '@nestjs/common';
import {UsersService} from "./users.service";
import {Serialize} from "../interceptors/serialize.interceptor";
import {UserDto} from "../dtos/user.dto";
import {UpdateUserDto} from "../dtos/update-user.dto";
import {AuthGuard} from "../guard/auth.guard";
import {CurrentUser} from "../decorators/current-user.decorator";
import {ApiBody} from "@nestjs/swagger";

@Controller('users')
@Serialize(UserDto)
@UseGuards(AuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('by-email')
    getByEmail(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Get('all')
    findAllUsers() {
        return this.usersService.findAll();
    }

    @Patch('me')
    @ApiBody({schema:{type:'object', properties:{password:{type:'string'}}}})
    updateMe(@Body('password') password:string,@Session() s:any){
        return this.usersService.updatePassword(s.userId,password)
    }

    @Get(':id')
    findUser(@Param('id') id: string) {
        return this.usersService.findOne(parseInt(id));
    }

     @Patch()
    updateUser(@Body() body:UpdateUserDto,@Session() s:any){
        return this.usersService.update(s.userId,body)
     }

    @Delete()
    async removeUser(@Session() s: any) {
        const result = await this.usersService.remove(s.userId);
        if (result) {
            s.userId = null;
        }
        return result;
    }

}
