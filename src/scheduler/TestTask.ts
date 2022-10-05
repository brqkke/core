import { AbstractTask, Task } from './Task';

@Task({
  name: 'TEST_TASK',
  interval: 60 * 1000,
})
export class TestTask extends AbstractTask {
  run(): Promise<any> {
    this.log('Yey', 'info');
    return Promise.resolve(undefined);
  }
}
