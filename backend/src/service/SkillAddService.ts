import pg from 'pg';
import pool from '@/config/db';

export class SkillAddService {

  conn?: pg.PoolClient;

  constructor(private client: pg.PoolClient) {
    this.conn = client;
  }
  
  async add(param: SkillAddParam): Promise<SkillAddResult> {
    // DB接続
    const client = await pool.connect();
    try {

      // わざIDを採番      
      const sequenceSql = `SELECT nextval('skill_id_seq') AS skill_id`;
      const sequenceResult = await client.query(sequenceSql);
      const skill_id = sequenceResult.rows[0].skill_id;

      // 新規レコード登録
      const insertSql
        = `INSERT INTO skill(skill_id, skill_name, skill_description, type_code, skill_attr_code, power, hit, max_pp, create_at, update_at, create_pgm, update_pgm)
                      VALUES($1,       $2,         $3,                $4,        $5,              $6,    $7,  $8,     now(),     now(),     $9,         $10)`;
      const insertParams: Array<any> = [skill_id, param.skill_name, param.skill_description, param.type_code, param.skill_attr_code, param.power, param.hit, param.max_pp, param.pgm_id, param.pgm_id];
      const totalResult = await client.query(insertSql, insertParams);

      // 結果返却
      return {skill_id: skill_id};
    } finally {
      if (client) {
        // DB切断
        client.release();
      }
    }
  }

}

export interface SkillAddParam {
  skill_name: string;
  skill_description: string;
  type_code: string;
  skill_attr_code: string;
  power: number | undefined;
  hit: number | undefined;
  max_pp: number;
  pgm_id: string;
}
export interface SkillAddResult {
  skill_id: number;
}