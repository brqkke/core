import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { PrismaClient } from "@prisma/client";
import { EntityManager } from "typeorm";
import { UserRole } from "./entities/enums/UserRole";
import { UserStatus } from "./entities/enums/UserStatus";
import { OrderStatus } from "./entities/enums/OrderStatus";
import { OrderCurrency } from "./entities/enums/OrderCurrency";
import { User } from "./entities/User";
import { Order } from "./entities/Order";
import { EventLog, EventLogType } from "./entities/EventLog";

process.env.TZ = "UTC";
const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "stdout",
      level: "error",
    },
    {
      emit: "stdout",
      level: "info",
    },
    {
      emit: "stdout",
      level: "warn",
    },
  ],
});
prisma.$on("query", (e) => {
  console.log("Query: " + e.query);
  console.log("Params: " + e.params);
  console.log("Duration: " + e.duration + "ms");
});

AppDataSource.initialize()
  .then((ds) => {
    const userIdMap = new Map<number, string>();
    return ds.transaction(async (em) => {
      // for (const entity of [EventLog, Order, Token, Session, Task, User]) {
      //   const repo = em.getRepository(entity);
      //   await repo.query(`TRUNCATE TABLE "${repo.metadata.tableName}" CASCADE`);
      // }
      const oldUsers = await prisma.user.findMany({
        include: { token: true },
        // where: {
        //   email: {
        //     endsWith: "uazo.com"
        //   }
        // }
      });
      throw new Error("STOP");
      console.table(oldUsers);

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
        // if (oldUser.token) {
        //   const { token } = oldUser;
        //   await em.getRepository(Token).save({
        //     userId: newUser.id,
        //     status: TokenStatus[token.status],
        //     accessToken: token.accessToken,
        //     refreshToken: token.refreshToken,
        //     refreshTriesCount: token.refreshTriesCount,
        //     lastRefreshTriedAt: token.lastRefreshTriedAt,
        //     lastRefreshedAt: token.lastRefreshTriedAt,
        //     version: 1,
        //   });
        // }
      }

      // const oldTasks = await prisma.task.findMany();
      // for (const oldTask of oldTasks) {
      //   await em.getRepository(Task).save({
      //     name: oldTask.name,
      //     lastRunAt: oldTask.lastRunAt,
      //   });
      // }

      const oldEventLogs = await prisma.tokenLogs.findMany({
        where: {
          data: {
            in: oldUsers.map((u) => u.id),
          },
        },
      });
      await em.getRepository(EventLog).delete({ data: "" });
      for (const oldLog of oldEventLogs) {
        await em.getRepository(EventLog).save({
          type: EventLogType.BROKEN_TOKEN,
          createdAt: oldLog.createdAt,
          data: userIdMap.get(oldLog.data) || "",
        });
      }
      // const r = await em.query(
      //   `UPDATE "order" SET "userId" = '65dd3094-32c3-4cb9-8e54-5afa20db691a' WHERE "userId" = '295140a0-697b-4aa3-9ef2-21b727b7866c';`
      // );
      // console.log(r);
      throw new Error("rollback");
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
