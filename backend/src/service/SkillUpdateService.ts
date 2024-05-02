import pg from 'pg';
import pool from '@/config/db';

/**
 * わざ更新サービス
 */
export class SkillUpdateService {

  conn?: pg.PoolClient;

  /**
   * @param client DBクライアント
   */
  constructor(private client: pg.PoolClient) {
    this.conn = client;
  }

  /**
   * わざ更新
   * @param param パラメータ
   * @returns 更新件数
   */
  async update(param: SkillUpdateParam): Promise<number> {
    // DB接続
    const client = await pool.connect();
    try {

      // レコード更新
      const sql
        = `UPDATE skill SET skill_name = $2, skill_description = $3, type_code = $4, skill_attr_code = $5, power = $6, hit = $7, max_pp = $8, update_at = now(), update_pgm = $9
           WHERE skill_id = $1`;
      const params: Array<any> = [param.skill_id, param.skill_name, param.skill_description, param.type_code, param.skill_attr_code, param.power, param.hit, param.max_pp, param.pgm_id];
      const queryResult = await client.query(sql, params);

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
 * @property skill_id わざID
 * @property skill_name わざ名
 * @property skill_description わざ説明
 * @property type_code タイプコード
 * @property skill_attr_code わざ種別コード
 * @property power 威力
 * @property hit 命中率
 * @property max_pp 最大PP
 * @property pgm_id プログラムID
 */
export interface SkillUpdateParam {
  skill_id: number;
  skill_name: string;
  skill_description: string;
  type_code: string;
  skill_attr_code: string;
  power: number | undefined;
  hit: number | undefined;
  max_pp: number;
  pgm_id: string;
}
