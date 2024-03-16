import pg from 'pg';

export class SkillSearchService {
  private pool: pg.Pool;

  constructor() {
    this.pool = new pg.Pool();
  }

  async searchSkills(search: string): Promise<string[]> {
    const client = await this.pool.connect();
    const result = await client.query(
      'SELECT name FROM skills WHERE name ILIKE $1',
      [`%${search}%`]
    );
    client.release();
    return result.rows.map((row) => row.name);
  }
}

export interface SkillSearchParam {
  skill_name: string;
  offset: number;
  pagesize: number;
}
export interface SkillSearchResult {
  
}