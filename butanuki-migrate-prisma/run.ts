import "reflect-metadata";
import * as dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import { User } from "./entities/User";
import { PrismaClient } from "@prisma/client";
import { UserRole } from "./entities/enums/UserRole";
import { UserStatus } from "./entities/enums/UserStatus";
import { EntityManager } from "typeorm";
import { Order } from "./entities/Order";
import { OrderStatus } from "./entities/enums/OrderStatus";
import { OrderCurrency } from "./entities/enums/OrderCurrency";
import { Token } from "./entities/Token";
import { TokenStatus } from "./entities/enums/TokenStatus";
import { Task } from "./entities/Task";
import { EventLog, EventLogType } from "./entities/EventLog";

dotenv.config();
process.env.TZ = "UTC";
const prisma = new PrismaClient();

AppDataSource.initialize()
  .then((ds) => {
    const userIdMap = new Map<number, string>();
    return ds.transaction(async (em) => {
      const oldUsers = await prisma.user.findMany({ include: { token: true } });
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
          });
        }
      }

      const oldTasks = await prisma.task.findMany();
      for (const oldTask of oldTasks) {
        await em.getRepository(Task).save({
          name: oldTask.name,
          lastRunAt: oldTask.name,
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

      // throw new Error("abort");
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