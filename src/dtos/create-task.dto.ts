import { IsString, IsDateString, IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {

    @ApiProperty({ example: "Finish NestJS project" })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: "Complete backend API" })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: "2026-03-10" })
    @IsDateString()
    dueDate: Date;
}