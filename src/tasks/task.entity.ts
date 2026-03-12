import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum TaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in-progress',
    COMPLETED = 'completed',
}

@Entity()
export class Task {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    dueDate: Date;

    @Column({
        type: 'text',
        default: 'pending',
    })
    status: TaskStatus;

    @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
}