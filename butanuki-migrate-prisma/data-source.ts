import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Token } from "./entities/Token";
import { Order } from "./entities/Order";
import { Session } from "./entities/Session";
import { EventLog } from "./entities/EventLog";
import { Task } from "./entities/Task";
import conf from "./config";
console.log(conf);
export const AppDataSource = new DataSource({
  type: "postgres",
  host: conf.newDb.host,
  port: parseInt(conf.newDb.port),
  username: conf.newDb.user,
  password: conf.newDb.password,
  database: conf.newDb.name,
  synchronize: false,
  migrationsRun: false,
  logging: true,
  entities: [User, Token, Order, Session, EventLog, Task],
  subscribers: [],
  migrations: [],
  applicationName: "BTNK-migrate",
});
