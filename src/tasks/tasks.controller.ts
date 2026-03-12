import {Body, Controller, Delete, Get, Param, Patch, Post, Query, Session, UseGuards} from '@nestjs/common';
import {CreateTaskDto} from "../dtos/create-task.dto";
import {CurrentUser} from "../decorators/current-user.decorator";
import {User} from "../users/user.entity";
import {TasksService} from "./tasks.service";
import {AuthGuard} from "../guard/auth.guard";
import {Serialize} from "../interceptors/serialize.interceptor";
import {TaskDto} from "../dtos/task.dto";
import {UpdateTaskDto} from "../dtos/update-task.dto";
import {TaskQueryDto} from "../dtos/task-query.dto";
import {TaskStatus} from "./task.entity";
import {TaskOwnerGuard} from "../guard/task-owner.guard";
import {JwtAuthGuard} from "../guard/jwt.guard";
import {ApiBearerAuth, ApiBody} from "@nestjs/swagger";

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(private tasksService: TasksService) {
    }

    @Post()
    @Serialize(TaskDto)
    @ApiBearerAuth()
    createTask(@Body()body: CreateTaskDto,@CurrentUser()user: User) {
        return this.tasksService.createTask(body,user);
    }

    @Get('by-status/:status')
    @ApiBearerAuth()
    @ApiBody({schema:{type:'string', enum:[TaskStatus]}})
    byStatus(@Param('status') status: TaskStatus) {
        return this.tasksService.tsakByStatus(status);
    }

    @Get('all')
    @Serialize(TaskDto)
    @ApiBearerAuth()
    getTask() {
        return this.tasksService.getTask();
    }


    @Get('user/:id')
    @ApiBearerAuth()
    getAllTaskOfUser(@Param('id') id: string) {
        return this.tasksService.getAllTask(parseInt(id));
    }

    @Get('my')
    @ApiBearerAuth()
    getMyTask(@Session() s: any) {
        return this.tasksService.getAllTask(s.userId);
    }

    @Get()
    @ApiBearerAuth()
    getTasks(@Query() query: TaskQueryDto) {
        return this.tasksService.getTasks(query);
    }

    @Get(':id')
    @ApiBearerAuth()
    getTaskById(@Param('id') id: string) {
        return this.tasksService.getTaskById(parseInt(id));
    }

    @UseGuards(TaskOwnerGuard)
    @Patch(':id')
    @Serialize(TaskDto)
    @ApiBearerAuth()
    updateTask(@Param('id') id: string, @Body() body: UpdateTaskDto){
        return this.tasksService.updateTask(parseInt(id),body)
    }

    @Delete(':id')
    @UseGuards(TaskOwnerGuard)
    @Serialize(TaskDto)
    @ApiBearerAuth()
    deleteTask(@Param('id') id: string){
        return this.tasksService.deleteTask(parseInt(id));
    }
}
