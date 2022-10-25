import * as dotenv from "dotenv";

[".env.dev", ".env"].map((path) => dotenv.config({ path }));

export default {
  oldDb: process.env.OLD_DATABASE_URL,
  newDb: {
    password: process.env.NEW_DB_PASSWORD as string,
    user: process.env.NEW_DB_USER as string,
    host: process.env.NEW_DB_HOST as string,
    name: process.env.NEW_DB_NAME as string,
    port: process.env.NEW_DB_PORT as string,
  },
};
