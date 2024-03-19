import { Pool, PoolClient } from 'pg'

let pool: Pool;

/**
 * DB接続プールの初期化
 */
export function　initPool() {
    pool = new Pool({
        connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
}

/**
 * DB接続の取得
 * @returns DB接続
 */
export async function connect(): Promise<PoolClient> {
    return await pool.connect();
}

export default {
    initPool,
    connect
}