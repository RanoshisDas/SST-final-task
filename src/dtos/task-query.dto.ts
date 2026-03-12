import {IsNumberString, IsOptional, IsString} from "class-validator";
import { TaskStatus } from "../tasks/task.entity";
import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";

export class TaskQueryDto {

    @ApiProperty({ example: "pending", enum: TaskStatus,required: false })
    @IsOptional()
    status?: TaskStatus;

    @ApiProperty({ example: "Finish NestJS project",required: false })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ example: 1,required: false })
    @IsOptional()
    userId?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsNumberString()
    page?: number;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @IsNumberString()
    limit?: number;


}