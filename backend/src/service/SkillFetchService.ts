import pg from 'pg';
import pool from '@/config/db';

/**
 * わざ登録サービス
 */
export class SkillFetchService {

  conn?: pg.PoolClient;

  /**
   * @param client DBクライアント
   */
  constructor(private client: pg.PoolClient) {
    this.conn = client;
  }

  /**
   * わざ追加
   * @param param パラメータ
   * @returns 追加結果
   */
  async fetch(param: SkillFetchParam): Promise<SkillFetchResult> {
    // DB接続
    const client = await pool.connect();
    try {

      // わざ取得
      const sql = `SELECT skill_id, skill_name, skill_description, type_code, skill_attr_code, power, hit, max_pp FROM skill WHERE skill_id = $1`;
      const result = await client.query(sql, [param.skill_id]);
      
      return {
        data: result.rows[0]
      };
    } finally {
      if (client) {
        // DB切断
        client.release();
      }
    }
  }

}

/**
 * わざ取得パラメータ
 * @property skill_id わざID
 */
export interface SkillFetchParam {
  skill_id: number;
}

/**
 * わざ取得結果
 * @property skill_id わざID
 * @property skill_name わざ名
 * @property skill_description わざ説明
 * @property type_code タイプコード
 * @property skill_attr_code わざ種別コード
 * @property power 威力
 * @property hit 命中率
 * @property max_pp 最大PP
 */
export type SkillFetchResult = {
  data?: {
    skill_id: number;
    skill_name: string;
    skill_description: string;
    type_code: string;
    skill_attr_code: string;
    power: number | undefined;
    hit: number | undefined;
    max_pp: number;
  }
}