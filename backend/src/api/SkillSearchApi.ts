import express from 'express';
import {PoolClient} from 'pg';

import db from '@/config/db';
import {SkillSearchService} from '@/service/SkillSearchService';
import {isRequired, isNumeric, isMaxlen} from '@/util/validation';

export const router = express.Router();

router.get('/api/skill/search', async (req: express.Request, res: express.Response) => {
    const query:  {
        skill_name?: string;
        offset?:     string;
        limit?:   string;
    } = req.query;

    // パラメータ検証
    const errors = [];
    errors.push(
        isMaxlen(query.skill_name, 'スキル名', 50),

        isRequired(query.offset, 'offset'),
        isNumeric(query.offset, 'offset'),
        
        isRequired(query.limit, 'limit'),
        isNumeric(query.limit, 'limit'),
    );
    
    if (errors.some((v) => v !== undefined)) {
        // エラーありの場合、エラー応答を返却
        res.status(400).json({errors: errors.filter((v) => v !== undefined)});
        return;
    }

    // DB接続
    let conn: (PoolClient)[] = [];
    try {
        res.status(200).json({});
    } finally {
        if (conn) {
            // DB切断
            conn.forEach(c => c.release());
        }
    }
});


export interface SkillSearchParam {
    skill_name?: string;
    offset?:     number;
    limit?:   number;
}
export interface SkillSearchResult {

}