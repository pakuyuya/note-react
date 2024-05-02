import express from 'express';
import {PoolClient} from 'pg';
import path from 'path';

import db from '@/config/db';
import {SkillUpdateService} from '@/service/SkillUpdateService';
import {isRequired, isNumeric, isMaxlen, isRange} from '@/util/validation';


export const router = express.Router();

/**
 * わざ更新API
 */
router.post('/api/skill/update/:skill_id', async (req: express.Request, res: express.Response) => {
    const API_NAME = 'POST /api/skill/update/:skill_id';
    console.log(API_NAME, 'with parameter: ', req.params, req.body);

    // リクエストパラメータ取得
    const {skill_id} = req.params;
    const body:  {
        skill_name: string;
        skill_description: string;
        type_code: string;
        skill_attr_code: string;
        power: number | undefined;
        hit: number | undefined;
        max_pp: number;
    } = req.body;

    // パラメータ検証
    const errors = [];
    errors.push(
        isRequired(skill_id, 'わざID'),
        isNumeric(skill_id, 'わざID'),

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
        const service = new SkillUpdateService(conn);
        const updateCount = await service.update({
            skill_id: Number(skill_id),
            skill_name: body.skill_name,
            skill_description: body.skill_description,
            type_code: body.type_code,
            skill_attr_code: body.skill_attr_code,
            power: body.power,
            hit: body.hit,
            max_pp: body.max_pp,
            pgm_id: '/api/skill/update',
        });

        if (updateCount <= 0) {
            // 更新対象なしの場合、404応答
            console.log(API_NAME, '404 Not Found');
            res.status(404).json({errors: ['指定されたわざが見つかりません']});
        }

        res.status(201).json({data: {skill_id: skill_id}});
    } finally {
        if (conn) {
            // DB切断
            conn.release();
        }
    }
});
