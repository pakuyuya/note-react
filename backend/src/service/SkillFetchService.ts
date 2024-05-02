import pg from 'pg';
import pool from '@/config/db';

/**
 * わざ取得サービス
 */
export class SkillFetchService {

  /** DBクライアント */
  conn?: pg.PoolClient;

  /**
   * コンストラクタ
   * @param client DBクライアント
   */
  constructor(private client: pg.PoolClient) {
    this.conn = client;
  }

  /**
   * わざ追加
   * @param param パラメータ
   * @returns 取得結果
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
 * @property data わざ情報。取得できなかった場合はundefined
 * @property data.skill_id わざID
 * @property data.skill_name わざ名
 * @property data.skill_description わざ説明
 * @property data.type_code タイプコード
 * @property data.skill_attr_code わざ種別コード
 * @property data.power 威力
 * @property data.hit 命中率
 * @property data.max_pp 最大PP
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