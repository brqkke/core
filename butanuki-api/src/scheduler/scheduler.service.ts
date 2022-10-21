import { Injectable } from '@nestjs/common';
import { TaskRunner } from './TaskRunner';
import { AbstractTask } from './Task';

@Injectable()
export class SchedulerService {
  constructor(private taskRunner: TaskRunner) {}
  private started = false;
  private runningPromise: Promise<void>;
  public stop() {
    this.started = false;
    return this.runningPromise.catch();
  }

  public async start() {
    this.started = true;
    const tasks = await this.taskRunner.initAll();
    this.runningPromise = this.run(tasks);

    return this.runningPromise;
  }

  protected async run(tasks: AbstractTask[]) {
    while (this.started) {
      const loopStart = Date.now();
      let totalRealRun = 0;
      for (const task of tasks) {
        if (!this.started) {
          break;
        }
        const { took } = await task._run();
        task.log('Took ' + took / 1000 + ' s');
        totalRealRun += took;
        await new Promise((r) => setTimeout(r, 1 * 1000));
      }
      const loopDone = Date.now();
      console.log('Loop ended, took : ' + (loopDone - loopStart) / 1000 + ' s');
      console.log('Took (real) ' + totalRealRun / 1000 + ' s');
      await new Promise((r) => setTimeout(r, 1 * 1000));
    }
  }
}
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
