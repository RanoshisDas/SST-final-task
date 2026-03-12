import {IsEmail, IsNotEmpty, IsString, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class LoginUserDto {

    @ApiProperty({example:"ranoshisdas@gmail.com"})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({example:"Pass123"})
    @MinLength(6)
    @IsNotEmpty()
    @IsString()
    password: string;
}