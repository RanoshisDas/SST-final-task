import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Task, TaskStatus} from "./task.entity";
import {Repository} from "typeorm";
import {CreateTaskDto} from "../dtos/create-task.dto";
import {User} from "../users/user.entity";
import {TaskQueryDto} from "../dtos/task-query.dto";

@Injectable()
export class TasksService {
    constructor(@InjectRepository(Task) private taskRepository: Repository<Task>) {}

    createTask(task:CreateTaskDto,user:User){
        const newTask=this.taskRepository.create({...task,user});
        // newTask.user=user;
        return this.taskRepository.save(newTask);
    }

    async getTasks(query: TaskQueryDto) {
        const {
            page = 1,
            limit = 10,
            status,
            title
            ,userId
        } = query;

        const qb = this.taskRepository.createQueryBuilder("task");
        if (status) {
            qb.andWhere("task.status = :status", { status });
        }
        if (title) {
            qb.andWhere("task.title LIKE :title", { title: `%${title}%` });
        }
        if (userId) {
            qb.andWhere("task.userId = :userId", { userId });
        }
        qb.orderBy("task.dueDate", "ASC");
        qb.skip((page - 1) * limit);
        qb.take(limit);

        const [tasks, total] = await qb.getManyAndCount();

        return {
            data: tasks,
            total,
            page,
            limit,
        };
    }

    getTaskById(id: number) {
        return this.taskRepository.findOne({where: {id}, relations: ['user']});
    }

    getAllTask(userId: number) {
        return this.taskRepository.find({
           where: {user: {id: userId}}
       });
    }

    getDueTask(userId: number) {
        return this.taskRepository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.user', 'user')
            .where('user.id = :userId', { userId })
            .andWhere('task.dueDate < :today', { today: new Date() })
            .andWhere('task.status != :completed', { completed: TaskStatus.COMPLETED })
            .getMany();
    }

    getStats(userId: number) {
        return this.taskRepository
            .createQueryBuilder('task')
            .select('task.status, COUNT(task.id) as count')
            .where('task.userId = :userId', { userId })
            .groupBy('task.status')
            .getRawMany();
    }

    getTaskLike(search:string){
        return this.taskRepository.createQueryBuilder("task")
            .where("task.title LIKE :search",{search:`%${search}%`})
            .getMany()
    }

    async bulkUpdateStatus(taskIds: number[], status: TaskStatus) {
        const result = await this.taskRepository.update(taskIds, { status });

        if (result.affected === 0) {
            throw new NotFoundException("No tasks found to update");
        }

        return {totalTasksUpdated : result.affected};
    }

    async updateTask(id: number, attrs: Partial<Task>) {
        const task = await this.taskRepository.findOne({
            where: { id }, relations: {user: true,},
        });

        if (!task) {
            throw new NotFoundException('Task not found');
        }
        Object.assign(task, attrs);
        return this.taskRepository.save(task);
    }

    async taskComplete(id: number) {
        const task = await this.taskRepository.findOne({where: {id}, relations: ['user']});
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        task.status = TaskStatus.COMPLETED;
        return this.taskRepository.save(task);
    }

    async taskInProcess(id: number) {
        const task = await this.taskRepository.findOne({where: {id}, relations: ['user']});
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        task.status = TaskStatus.IN_PROGRESS;
        return this.taskRepository.save(task);
    }

    getTask(){
        return this.taskRepository.find({relations:["user"]});
    }

    async deleteTask(id: number) {
        const task = await this.taskRepository.findOne({where: {id}, relations: ['user']});
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        return this.taskRepository.remove(task)
    }

    tsakByStatus(status:TaskStatus){
        const query=this.taskRepository.createQueryBuilder('task');
        query.where('task.status=:status',{status});
        return query.getMany();
    }
}
