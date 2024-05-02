import express from 'express';
import {PoolClient} from 'pg';

import db from '@/config/db';
import {SkillSearchService, SkillSearchResult} from '@/service/SkillSearchService';
import {isRequired, isNumeric, isMaxlen} from '@/util/validation';

export const router = express.Router();

/**
 * わざ検索API
 */
router.get('/api/skill/search', async (req: express.Request, res: express.Response) => {
    const API_NAME = 'GET /api/skill/search';
    console.log(API_NAME, 'with parameter: ', req.query);

    // リクエストパラメータ取得
    const query:  {
        // わざ名
        skill_name?: string;
        // オフセット
        offset?:     string;
        // 最大取得件数
        limit?:   string;
    } = req.query;
    console.debug('with parameter', query);

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
        console.log(API_NAME, '400 Bad Request');
        res.status(400).json({errors: errors.filter((v) => v !== undefined)});
        return;
    }

    let conn: PoolClient | undefined;
    try {
        // DB接続
        conn = await db.connect();

        // service実行
        const service = new SkillSearchService(conn);
        const result = await service.searchSkills({
            skill_name: query.skill_name,
            offset: parseInt(query.offset || '0'),
            limit: parseInt(query.limit || '20'),
        });

        // 正常応答
        console.log(API_NAME, '200 OK');
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