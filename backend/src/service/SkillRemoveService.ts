import pg from 'pg';
import pool from '@/config/db';

/**
 * わざ削除サービス
 */
export class SkillRemoveService {

  conn?: pg.PoolClient;

  /**
   * @param client DBクライアント
   */
  constructor(private client: pg.PoolClient) {
    this.conn = client;
  }

  /**
   * わざ削除
   * @param param パラメータ
   * @returns 削除件数
   */
  async remove(param: SkillRemoveParam): Promise<number> {
    // DB接続
    const client = await pool.connect();
    try {

      // レコード更新
      const sql
        = `DELETE FROM skill
           WHERE skill_id IN (${param.skill_ids.map((_, i) => `$${i + 1}`).join(', ')})`;
      const queryResult = await client.query(sql, param.skill_ids);

      // 結果返却
      return queryResult.rowCount || 0;
    } finally {
      if (client) {
        // DB切断
        client.release();
      }
    }
  }

}

/**
 * わざ更新パラメータ
 * @property skill_ids わざID
 */
export interface SkillRemoveParam {
  skill_ids: number[];
}
