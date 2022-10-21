import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common';

export const TASK_OPTIONS_KEY = 'TASK';
export type TaskOptions = {
  name: string;
};
export const Task = (options: TaskOptions) =>
  applyDecorators(SetMetadata(TASK_OPTIONS_KEY, options), Injectable());

export abstract class AbstractTask {
  private running = false;
  public options?: TaskOptions;

  abstract run(): Promise<any | void>;

  protected get name() {
    return this.options?.name || 'TASK_NO_NAME';
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

  async shouldRun() {
    return true;
  }

  async _run(): Promise<{ took: number }> {
    const start = Date.now();
    if (this.running || !(await this.shouldRun().catch(() => false))) {
      console.log(
        `[${new Date().toISOString()}][Scheduler] [${this.name}] Skip`,
      );
      return { took: Date.now() - start };
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
    return { took: Date.now() - start };
  }

  onError(err: Error) {
    console.error(err);
  }
}
