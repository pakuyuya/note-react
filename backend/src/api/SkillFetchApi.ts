import express from 'express';
import {PoolClient} from 'pg';

import db from '@/config/db';
import {SkillFetchService} from '@/service/SkillFetchService';
import {isRequired, isNumeric, isMaxlen, isRange} from '@/util/validation';

export const router = express.Router();

/**
 * わざ取得API
 */
router.get('/api/skill/fetch/:skill_id', async (req: express.Request, res: express.Response) => {
    const API_NAME = 'GET /api/skill/fetch/:skill_id';
    console.log(API_NAME, 'with parameter: ', req.params);

    // リクエストパラメータ取得
    const {skill_id} = req.params;

    // パラメータ検証
    const errors = [];
    errors.push(
        isRequired(skill_id, 'わざID'),
        isNumeric(skill_id, 'わざID'),
    );
    
    // errorsから、undefined（エラー無し）以外の結果を探索
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
        const service = new SkillFetchService(conn);
        const result = await service.fetch({skill_id: Number(skill_id)});

        // 正常応答
        console.log(API_NAME, '200 OK');
        res.status(200).json({
            data: result.data,
        });
    } finally {
        if (conn) {
            // DB切断
            conn.release();
        }
    }
});