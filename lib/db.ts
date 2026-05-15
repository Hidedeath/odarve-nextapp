import mysql, { type Pool, type PoolOptions } from "mysql2/promise";

declare global {
  var mysqlPool: Pool | undefined;
}

function getPoolConfig(): PoolOptions {
  const host = process.env.DB_HOST;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME;

  if (!host || !user || !database) {
    throw new Error(
      "Database environment variables are missing. Please configure DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME.",
    );
  }

  return {
    host,
    user,
    password,
    database,
    port: Number(process.env.DB_PORT ?? 3306),
    connectionLimit: 10,
  };
}

export function getDbPool(): Pool {
  if (!global.mysqlPool) {
    global.mysqlPool = mysql.createPool(getPoolConfig());
  }

  return global.mysqlPool;
}
