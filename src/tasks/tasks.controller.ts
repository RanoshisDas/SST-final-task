import {Body, Controller, Delete, Get, Param,Request, Patch, Post, Query, Session, UseGuards} from '@nestjs/common';
import {CreateTaskDto} from "../dtos/create-task.dto";
import {CurrentUser} from "../decorators/current-user.decorator";
import {User} from "../users/user.entity";
import {TasksService} from "./tasks.service";
import {Serialize} from "../interceptors/serialize.interceptor";
import {TaskDto} from "../dtos/task.dto";
import {UpdateTaskDto} from "../dtos/update-task.dto";
import {TaskQueryDto} from "../dtos/task-query.dto";
import {TaskStatus} from "./task.entity";
import {TaskOwnerGuard} from "../guard/task-owner.guard";
import {JwtAuthGuard} from "../guard/jwt.guard";
import {ApiBearerAuth, ApiBody} from "@nestjs/swagger";
import {BulkUpdateStatusDto} from "../dtos/builk-status-update.dto";

@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
    constructor(private tasksService: TasksService) {
    }

    @Post()
    @Serialize(TaskDto)
    createTask(@Body()body: CreateTaskDto,@CurrentUser()user: User) {
        return this.tasksService.createTask(body,user);
    }

    @Get('by-status/:status')
    @ApiBody({schema:{type:'string', enum:[TaskStatus]}})
    byStatus(@Param('status') status: TaskStatus) {
        return this.tasksService.tsakByStatus(status);
    }

    @Get('all')
    @Serialize(TaskDto)
    getTask() {
        return this.tasksService.getTask();
    }

    @Get('user/:id')
    getAllTaskOfUser(@Param('id') id: string) {
        return this.tasksService.getAllTask(parseInt(id));
    }

    @Get('my')
    getMyTask(@Session() s: any) {
        return this.tasksService.getAllTask(s.userId);
    }

    @Get()
    getTasks(@Query() query: TaskQueryDto) {
        return this.tasksService.getTasks(query);
    }

    @Get('overdue')
    @Serialize(TaskDto)
    getOverdue(@Request() req: any){
        return this.tasksService.getDueTask(req.user.id);
    }

    @Get('stats')
    getStats(@Request() req: any){
        return this.tasksService.getStats(req.user.id);
    }

    @Patch('bulk-update')
    bulkUpdateStatus(@Body()body:BulkUpdateStatusDto ) {
        return this.tasksService.bulkUpdateStatus(body.taskIds, body.status);
    }

    @Get(':id')
    getTaskById(@Param('id') id: string) {
        return this.tasksService.getTaskById(parseInt(id));
    }

    @UseGuards(TaskOwnerGuard)
    @Patch(':id')
    @Serialize(TaskDto)
    updateTask(@Param('id') id: string, @Body() body: UpdateTaskDto){
        return this.tasksService.updateTask(parseInt(id),body)
    }

    @UseGuards(TaskOwnerGuard)
    @Patch(':id/complete')
    @Serialize(TaskDto)
    updateTaskComplete(@Param('id') id: string){
        return this.tasksService.taskComplete(parseInt(id))
    }

    @UseGuards(TaskOwnerGuard)
    @Patch(':id/in-progress')
    @Serialize(TaskDto)
    updateTaskInProcess(@Param('id') id: string){
        return this.tasksService.taskInProcess(parseInt(id))
    }

    @Delete(':id')
    @UseGuards(TaskOwnerGuard)
    @Serialize(TaskDto)
    deleteTask(@Param('id') id: string){
        return this.tasksService.deleteTask(parseInt(id));
    }
}
