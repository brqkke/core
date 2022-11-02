import { Injectable } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { MigrateScriptService } from '../migrate-script/migrate-script.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class CommandService {
  private readonly commands = {
    'init-vaults': new CommandHolder(MigrateScriptService, 'initVaults'),
  };

  constructor(private moduleRef: ModuleRef) {}

  isValid(cmd: string): cmd is keyof typeof this.commands {
    return cmd in this.commands;
  }

  async run(command: string, args: string[]) {
    if (this.isValid(command)) {
      const cmd = this.commands[command];
      const instance = await this.moduleRef.create(cmd.getService());
      return cmd.callWithArgs(instance, args);
    }
    throw new Error(
      `Command ${command} not found. Available commands: ${Object.keys(
        this.commands,
      ).map((str) => `\n\t- ${str}`)}`,
    );
  }
}

type Command<
  Call extends keyof T,
  T extends { [key in Call]: (...args: string[]) => Promise<void> },
> = {
  service: Type<T>;
  call: Call;
};

class CommandHolder<
  Service extends Type<{
    [key in Call]: (...args: string[]) => Promise<void>;
  }>,
  Call extends string,
> {
  constructor(private service: Service, private call: Call) {}

  callWithArgs(instance: InstanceType<Service>, args: string[]) {
    return instance[this.call](...args);
  }

  getService() {
    return this.service;
  }
}
