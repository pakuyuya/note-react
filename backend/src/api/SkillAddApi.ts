import express from 'express';
import {PoolClient} from 'pg';

import db from '@/config/db';
import {SkillAddService, SkillAddParam, SkillAddResult} from '@/service/SkillAddService';
import {isRequired, isNumeric, isMaxlen, isRange} from '@/util/validation';

export const router = express.Router();

/**
 * わざ追加API
 */
router.post('/api/skill/add', async (req: express.Request, res: express.Response) => {
    const API_NAME = 'POST /api/skill/add';
    console.log(API_NAME, 'with parameter: ', req.body);

    // リクエストパラメータ取得
    const body: {
        skill_name: string;
        skill_description: string;
        type_code: string;
        skill_attr_code: string;
        power: number | undefined;
        hit: number | undefined;
        max_pp: number;
    } = req.body;

    // リクエストパラメータ検証
    const errors = [];
    errors.push(
        isMaxlen(body.skill_name, 'わざ名', 30),
        isRequired(body.skill_name, 'わざ名'),

        isMaxlen(body.skill_description, 'わざ説明', 400),

        isMaxlen(body.type_code, 'タイプ', 2),
        isRequired(body.type_code, 'タイプ'),

        isMaxlen(body.skill_attr_code, '種別', 1),
        isRequired(body.type_code, '種別'),
        
        isRange(body.power, '威力', 0, 999),
        isNumeric(body.power, '威力'),

        isRange(body.hit, '命中率', 0, 100),
        isNumeric(body.hit, '命中率',),

        isRange(body.max_pp, '最大PP', 0, 99),
        isNumeric(body.max_pp, '最大PP'),
        isRequired(body.max_pp, '最大PP'),
    );
    
    // errorsから、undefined（エラー無し）以外の結果を探索
    if (errors.some((v) => v !== undefined)) {
        // リクエストパラメータエラーありの場合、400応答
        console.log(API_NAME, '400 Bad Request');
        res.status(400).json({errors: errors.filter((v) => v !== undefined)});
        return;
    }

    let conn: PoolClient | undefined;
    try {
        // DB接続
        conn = await db.connect();

        // Service実行
        const service = new SkillAddService(conn);
        const result = await service.add({
            skill_name: body.skill_name,
            skill_description: body.skill_description,
            type_code: body.type_code,
            skill_attr_code: body.skill_attr_code,
            power: body.power,
            hit: body.hit ,
            max_pp: body.max_pp,
            pgm_id: '/api/skill/add',
        });

        // 正常応答
        console.log(API_NAME, '201 Created');
        res.status(201).json({
            data: {
                skill_id: result.skill_id,
            }
        });
    } finally {
        if (conn) {
            // DB切断
            conn.release();
        }
    }
});