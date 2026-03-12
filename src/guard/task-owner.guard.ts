import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
} from "@nestjs/common";
import {TasksService} from "../tasks/tasks.service";


@Injectable()
export class TaskOwnerGuard implements CanActivate {

    constructor(private tasksService: TasksService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest();

        const user = request.currentUser;
        const taskId = request.params.id;

        const task = await this.tasksService.getTaskById(taskId);

        if (!task) {
            throw new ForbiddenException("Task not found");
        }

        if (task.user.id !== user.id) {
            throw new ForbiddenException("You do not own this task");
        }

        return true;
    }
}