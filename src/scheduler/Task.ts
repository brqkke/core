import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';

export const TASK_OPTIONS_KEY = 'TASK';
export type TaskOptions = {
  name: string;
  interval: number;
};
export const Task = (options: TaskOptions) =>
  applyDecorators(SetMetadata(TASK_OPTIONS_KEY, options), Injectable());

export abstract class AbstractTask {
  private running = false;
  public options?: TaskOptions;

  private intervalId?: NodeJS.Timeout;
  abstract run(): Promise<any | void>;

  private get name() {
    return this.options?.name || 'TASK_NO_NAME';
  }

  private get interval() {
    return this.options?.interval || 60 * 1000;
  }

  log(data: any, level: 'log' | 'error' | 'info' = 'log') {
    const txt = `[${new Date().toISOString()}][Scheduler] [${this.name}]`;
    switch (level) {
      case 'error':
        console.error(txt, data);
        break;
      case 'info':
        console.info(txt, data);
        break;
      case 'log':
      default:
        console.log(txt, data);
    }
  }

  setIntervalId(id: NodeJS.Timeout) {
    this.intervalId = id;
  }

  clearInterval() {
    if (this.intervalId) {
      this.log('Clearing');
      clearInterval(this.intervalId);
    }
    this.intervalId = undefined;
  }

  async shouldRun() {
    return true;
  }

  async _run() {
    if (this.running || !(await this.shouldRun())) {
      console.log(
        `[${new Date().toISOString()}][Scheduler] [${this.name}] Skip`,
      );
      return;
    }

    this.running = true;

    console.log(
      `[${new Date().toISOString()}][Scheduler] [${this.name}] Running`,
    );
    try {
      await this.run();
    } catch (err) {
      if (err instanceof Error) {
        this.onError(err);
      } else {
        this.onError(new Error(JSON.stringify(err)));
      }
    } finally {
      console.log(
        `[${new Date().toISOString()}][Scheduler] [${this.name}] Done.`,
      );
      this.running = false;
    }
  }

  initTask() {
    this.setIntervalId(
      setInterval(async () => {
        this._run();
      }, this.interval),
    );
  }

  onError(err: Error) {
    console.error(err);
  }
}
