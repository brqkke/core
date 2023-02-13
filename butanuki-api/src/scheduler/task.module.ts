import { DynamicModule, Module } from '@nestjs/common';
import * as fs from 'fs';
import { importOrRequireFile } from 'typeorm/util/ImportUtils';
import path from 'path';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { AppConfigModule } from '../config/config.module';
import { DatabaseModule } from '../database/database.module';
import { BityModule } from '../bity/bity.module';
import { TaskRunner } from './TaskRunner';
import { OrderModule } from '../order/order.module';
import { MailerModule } from '../emails/mailer.module';
import { TASK_OPTIONS_KEY } from './Task';
import { RateModule } from '../rate/rate.module';
import { AlertModule } from '../alert/alert.module';

@Module({})
export class TaskModule {
  private static loadFileClasses(exported: any, allLoaded: Type[] = []) {
    if (typeof exported === 'function') {
      if (Reflect.hasMetadata(TASK_OPTIONS_KEY, exported)) {
        allLoaded.push(exported);
      }
    } else if (Array.isArray(exported)) {
      exported.forEach((i: any) => TaskModule.loadFileClasses(i, allLoaded));
    } else if (typeof exported === 'object') {
      Object.keys(exported).forEach((key) =>
        TaskModule.loadFileClasses(exported[key], allLoaded),
      );
    }
    return allLoaded;
  }
  static async registerAsync({
    pathName,
  }: {
    pathName: string;
  }): Promise<DynamicModule> {
    const files = fs
      .readdirSync(pathName)
      .filter((fname) => {
        return (
          fname.substring(fname.length - 5, fname.length) !== '.d.ts' &&
          fname.match(/\.([tj])s$/)
        );
      })
      .map((fname) => path.join(pathName, fname));

    const importResults = await Promise.all(
      files.map(async (path) => (await importOrRequireFile(path))[0]),
    );

    const classes = TaskModule.loadFileClasses(importResults);
    return {
      imports: [
        AppConfigModule,
        DatabaseModule,
        BityModule,
        OrderModule,
        MailerModule,
        RateModule,
        AlertModule,
      ],
      providers: [
        ...classes,
        TaskRunner,
        {
          provide: 'LOADED_TASKS',
          useValue: classes,
        },
      ],
      exports: [TaskRunner],
      module: TaskModule,
    };
  }
}
