import "reflect-metadata";
import * as dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import { PrismaClient } from "@prisma/client";
import { EntityManager } from "typeorm";
import { UserRole } from "./entities/enums/UserRole";
import { UserStatus } from "./entities/enums/UserStatus";
import { OrderStatus } from "./entities/enums/OrderStatus";
import { OrderCurrency } from "./entities/enums/OrderCurrency";
import { TokenStatus } from "./entities/enums/TokenStatus";
import { User } from "./entities/User";
import { Order } from "./entities/Order";
import { Token } from "./entities/Token";
import { Task } from "./entities/Task";
import { Session } from "./entities/Session";
import { EventLog, EventLogType } from "./entities/EventLog";

process.env.TZ = "UTC";
const prisma = new PrismaClient();

AppDataSource.initialize()
  .then((ds) => {
    const userIdMap = new Map<number, string>();
    return ds.transaction(async (em) => {
      for(const entity of [EventLog, Order, Token, Session, Task, User]) {
        const repo =  em.getRepository(entity);
        await repo.query(`TRUNCATE TABLE "${repo.metadata.tableName}" CASCADE`);
      }
      const oldUsers = await prisma.user.findMany({
        include: { token: true },
        // where: {
        //   email: {
        //     endsWith: "uazo.com"
        //   }
        // }
      });

      for (const oldUser of oldUsers) {
        const newUser = await em.getRepository(User).save({
          email: oldUser.email,
          role: UserRole.USER,
          status: UserStatus[oldUser.status],
          locale: oldUser.locale,
          tempCodeExpireAt: oldUser.tempCodeExpireAt,
          tempCode: oldUser.tempCode || undefined,
        });
        userIdMap.set(oldUser.id, newUser.id);
        await insertOrders({
          oldUserId: oldUser.id,
          newUserId: newUser.id,
          em,
          newPreviousOrderId: null,
          oldPreviousOrderId: null,
        });
        if (oldUser.token) {
          const { token } = oldUser;
          await em.getRepository(Token).save({
            userId: newUser.id,
            status: TokenStatus[token.status],
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
            refreshTriesCount: token.refreshTriesCount,
            lastRefreshTriedAt: token.lastRefreshTriedAt,
            lastRefreshedAt: token.lastRefreshTriedAt,
            version: 1
          });
        }
      }

      const oldTasks = await prisma.task.findMany();
      for (const oldTask of oldTasks) {
        await em.getRepository(Task).save({
          name: oldTask.name,
          lastRunAt: oldTask.lastRunAt,
        });
      }

      const oldEventLogs = await prisma.tokenLogs.findMany();
      for (const oldLog of oldEventLogs) {
        await em.getRepository(EventLog).save({
          type: EventLogType.BROKEN_TOKEN,
          createdAt: oldLog.createdAt,
          data: userIdMap.get(oldLog.data) || "",
        });
      }
    });
  })
  .catch((error) => console.log(error));

async function insertOrders(params: {
  oldUserId: number;
  newUserId: string;
  oldPreviousOrderId: number | null;
  newPreviousOrderId: string | null;
  em: EntityManager;
}) {
  const oldOrders = await prisma.order.findMany({
    where: {
      userId: params.oldUserId,
      previousOrderId: params.oldPreviousOrderId,
    },
  });

  for (const oldOrder of oldOrders) {
    const newOrder = await params.em.getRepository(Order).save({
      userId: params.newUserId,
      previousOrderId: params.newPreviousOrderId,
      status: OrderStatus[oldOrder.status],
      transferLabel: oldOrder.transferLabel,
      remoteId: oldOrder.remoteId,
      amount: oldOrder.amount,
      currency: OrderCurrency[oldOrder.currency],
      bankDetails: oldOrder.bankDetails || undefined,
      redactedCryptoAddress: oldOrder.redactedCryptoAddress || "",
      lastCheckedAt: oldOrder.lastCheckedAt,
      createdAt: oldOrder.createdAt,
      updatedAt: oldOrder.updatedAt,
    });
    await insertOrders({
      em: params.em,
      newUserId: params.newUserId,
      oldUserId: params.oldUserId,
      oldPreviousOrderId: oldOrder.id,
      newPreviousOrderId: newOrder.id,
    });
  }
}
