import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
import { GetTaskFilter } from './dto/get-task-filter.dto';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}
  getAllTasks = async (
    filterDto: GetTaskFilter,
    user: User,
  ): Promise<Task[]> => {
    const tasks = await this.taskRepository.getTasks(filterDto, user);
    return tasks;
  };
  getTaskById = async (id: number): Promise<Task> => {
    const found = await this.taskRepository.findOne(id);
    if (!found) throw new NotFoundException('Task not found');
    return found;
  };
  createTask = async (
    createTaskDto: CreateTaskDto,
    user: User,
  ): Promise<Task> => {
    return this.taskRepository.createTask(createTaskDto, user);
  };

  deleteTaskById = async (id: number): Promise<void> => {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('No Task Found');
    }
  };
  updateTaskStatus = async (id: number, status: TaskStatus): Promise<Task> => {
    let task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  };
}
