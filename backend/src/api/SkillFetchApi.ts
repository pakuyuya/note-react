import express from 'express';
import {PoolClient} from 'pg';

import db from '@/config/db';
import {SkillFetchService} from '@/service/SkillFetchService';
import {isRequired, isNumeric, isMaxlen, isRange} from '@/util/validation';

export const router = express.Router();

router.get('/api/skill/fetch/:skill_id', async (req: express.Request, res: express.Response) => {
    console.log('GET /api/skill/fetch/:skill_id');

    const {skill_id} = req.params;

    // パラメータ検証
    const errors = [];
    errors.push(
        isRequired(skill_id, 'わざID'),
        isNumeric(skill_id, 'わざID'),
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

        // SkillAddService実行
        const service = new SkillFetchService(conn);

        const result = await service.fetch({skill_id: Number(skill_id)});

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