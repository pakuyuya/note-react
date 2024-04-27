import pg from 'pg';
import pool from '@/config/db';

export class SkillSearchService {

  conn?: pg.PoolClient;

  constructor(private client: pg.PoolClient) {
    this.conn = client;
  }
  
  async searchSkills(param: SkillSearchParam): Promise<SkillSearchResult> {
    // DB接続
    const client = await pool.connect();
    try {
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
            type_name: row.type_name,
            skill_attr_code: row.skill_attr_code,
            skill_attr_name: row.skill_attr_name,
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

export interface SkillSearchParam {
  skill_name?: string;
  offset?:     number;
  limit?:   number;
}
export interface SkillSearchResult {
  datas: {
    skill_id: number;
    skill_name: string;
    type_code: string;
    type_name: string;
    skill_attr_code: string;
    skill_attr_name: string;
    power: number | null;
    hit: number | null;
    max_pp: number | null;
  }[];
  total: number;
}