import pg from 'pg';
import pool from '@/config/db';

/**
 * わざ検索サービス
 */
export class SkillSearchService {

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
   * わざ検索
   * @param param パラメータ
   * @returns 検索結果
   */
  async searchSkills(param: SkillSearchParam): Promise<SkillSearchResult> {
    // DB接続
    const client = await pool.connect();
    try {
      // ベースとなるSQLの取得
      const baseSql
        = `SELECT
            skill_id,
            skill_name,
            type_code,
            skill_attr_code,
            power,
            hit,
            max_pp
          FROM
            skill
          WHERE
            skill_name ILIKE $1`;

      const baseParams: Array<any> = [`%${param.skill_name}%`];

      // 全件数の取得
      const totalResult = await client.query(`SELECT COUNT(*) AS total FROM (${baseSql})`, baseParams);

      // 指定件数内のデータ取得
      const datasResult = await client.query(`${baseSql} LIMIT $2 OFFSET $3`, 
        [
          `%${param.skill_name}%`, // $1
          param.limit,             // $2
          param.offset             // $3
        ]
      );
      return {
        datas: datasResult.rows.map((row) => {
          return {
            skill_id: row.skill_id,
            skill_name: row.skill_name,
            type_code: row.type_code,
            skill_attr_code: row.skill_attr_code,
            power: row.power,
            hit: row.hit,
            max_pp: row.max_pp
          };
        }),
        total: totalResult.rows[0].total,
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
 * わざ検索パラメータ
 * @property skill_name わざ名
 * @property offset オフセット
 * @property limit 最大件数
 */
export interface SkillSearchParam {
  skill_name?: string;
  offset?:     number;
  limit?:   number;
}

/**
 * わざ検索結果
 * @property datas 検索結果
 * @property datas.skill_id わざID
 * @property datas.skill_name わざ名
 * @property datas.type_code タイプ
 * @property datas.skill_attr_code 種別
 * @property datas.power 威力
 * @property datas.hit 命中率
 * @property datas.max_pp 最大PP
 * @property total 全体件数
 */
export interface SkillSearchResult {
  datas: {
    skill_id: number;
    skill_name: string;
    type_code: string;
    skill_attr_code: string;
    power: number | null;
    hit: number | null;
    max_pp: number | null;
  }[];
  total: number;
}