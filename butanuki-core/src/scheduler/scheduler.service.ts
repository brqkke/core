import { Injectable } from '@nestjs/common';
import { TaskRunner } from './TaskRunner';

@Injectable()
export class SchedulerService {
  constructor(private taskRunner: TaskRunner) {}
  public start() {
    this.taskRunner.startAll();
  }
}
