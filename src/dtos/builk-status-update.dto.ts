import { IsArray, IsEnum } from "class-validator";
import { TaskStatus } from "../tasks/task.entity";
import {ApiProperty} from "@nestjs/swagger";

export class BulkUpdateStatusDto {

    @IsArray()
    @ApiProperty({ type: [Number] })
    taskIds: number[];

    @IsEnum(TaskStatus)
    @ApiProperty({ enum: TaskStatus })
    status: TaskStatus;

}