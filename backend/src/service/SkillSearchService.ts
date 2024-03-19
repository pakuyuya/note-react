import pg from 'pg';
import pool from '@/config/db';

export class SkillSearchService {
  
  async searchSkills(search: string): Promise<string[]> {
    const client = await pool.connect();
    const result = await client.query(
      'SELECT name FROM skills WHERE name ILIKE $1',
      [`%${search}%`]
    );
    client.release();
    return result.rows.map((row) => row.name);
  }
}