import {IsEmail, IsString, IsOptional, MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateUserDto {

    @ApiProperty({ example: "Ranoshis Das" })
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty({example:"example@gmail.com"})
    @IsEmail()
    @IsOptional()
    email: string;

    @ApiProperty({ example: "123456" })
    @MinLength(6)
    @IsString()
    @IsOptional()
    password: string;
}
