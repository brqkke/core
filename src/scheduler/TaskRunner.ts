import { ModuleRef, Reflector } from '@nestjs/core';
import { AbstractTask, TASK_OPTIONS_KEY, TaskOptions } from './Task';
import { SchedulerModule } from './scheduler.module';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskRunner {
  private tasksOptions = new Map<Type<AbstractTask>, TaskOptions>();

  constructor(private reflector: Reflector, private moduleRef: ModuleRef) {
    const providers = Reflect.getMetadata('providers', SchedulerModule);
    if (Array.isArray(providers)) {
      providers.forEach((provider) => this.register(provider));
    }
  }

  async register(task: Type) {
    if (!task) {
      return;
    }
    const taskOptions = this.reflector.get<TaskOptions | undefined>(
      TASK_OPTIONS_KEY,
      task,
    );
    if (taskOptions) {
      this.tasksOptions.set(task, taskOptions);
    }
  }

  async startAll() {
    await Promise.all(
      [...this.tasksOptions.entries()].map(async ([task, options], i) => {
        const taskInstance = await this.moduleRef.create<AbstractTask>(task);
        await wait(5 * i * 1000); //delay each task startup by 5 seconds from each other to avoid doing lots of work at the same time
        taskInstance.options = options;
        return taskInstance.initTask();
      }),
    );
  }
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
