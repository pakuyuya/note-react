import express from 'express';
import {PoolClient} from 'pg';

import db from '@/config/db';
import {SkillSearchService, SkillSearchResult} from '@/service/SkillSearchService';
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
        isMaxlen(query.skill_name, 'わざ名', 50),

        isRequired(query.offset, 'offset'),
        isNumeric(query.offset, 'offset'),
        
        isRequired(query.limit, 'limit'),
        isNumeric(query.limit, 'limit'),
    );
    
    if (errors.some((v) => v !== undefined)) {
        // パラメータエラーありの場合、400応答
        res.status(400).json({errors: errors.filter((v) => v !== undefined)});
        return;
    }

    let conn: PoolClient | undefined;
    try {
        // DB接続
        conn = await db.connect();

        // メイン処理

        // SkillSearchService実行
        const service = new SkillSearchService(conn);

        const result = await service.searchSkills({
            skill_name: query.skill_name,
            offset: parseInt(query.offset || '0'),
            limit: parseInt(query.limit || '20'),
        });

        res.status(200).json({
            datas: result.datas,
            total: result.total,
        });
    } finally {
        if (conn) {
            // DB切断
            conn.release();
        }
    }
});