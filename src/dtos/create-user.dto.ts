import {IsEmail, IsNotEmpty, IsString, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {

    @ApiProperty({ example: "Ranoshis Das" })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({example:"ranoshisdas@gmail.com"})
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: "123456" })
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;
}
