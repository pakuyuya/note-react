import express from 'express';
import {PoolClient} from 'pg';

import db from '@/config/db';
import {SkillRemoveService} from '@/service/SkillRemoveService';
import {isRequired, isNumeric, isMaxlen, isRange} from '@/util/validation';

export const router = express.Router();

/**
 * わざ削除API
 */
router.post('/api/skill/remove', async (req: express.Request, res: express.Response) => {
    console.log('POST /api/skill/remove with body: ', req.body);

    const body:  {
        skill_ids: number[];
    } = req.body;

    // パラメータ検証
    const errors = [];

    if (!body.skill_ids) {
        // skill_idsがundefiend、null、空配列の場合
        errors.push('skill_idsが指定されていません');
    } else {
        errors.push(...body.skill_ids.map((skill_id, i) => {
            return isRequired(skill_id, `skill_id[${i}]`) ||
                    isNumeric(skill_id, `skill_id[${i}]`);
        }));
    }

    let conn: PoolClient | undefined;
    try {
        // DB接続
        conn = await db.connect();

        // メイン処理

        // Service実行
        const service = new SkillRemoveService(conn);
        const removeCount = await service.remove({
            skill_ids: body.skill_ids,
        });

        if (removeCount <= 0) {
            res.status(404).json({errors: ['指定されたわざが見つかりません']});
        }

        res.status(201).json({count: removeCount});
    } finally {
        if (conn) {
            // DB切断
            conn.release();
        }
    }
});
