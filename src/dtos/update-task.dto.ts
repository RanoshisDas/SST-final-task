import {IsString, IsDateString, IsOptional, IsEnum} from "class-validator";
import {TaskStatus} from "../tasks/task.entity";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateTaskDto {
    @ApiProperty({ example: "Finish NestJS project" })
    @IsString()
    @IsOptional()
    title: string;

    @ApiProperty({ example: "Complete backend API" })
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({ example: "pending", enum: TaskStatus })
    @IsEnum(TaskStatus)
    @IsOptional()
    status: TaskStatus;

    @ApiProperty({ example: "2026-03-10" })
    @IsDateString()
    @IsOptional()
    dueDate: Date;
}