/**
 * スキル検索パラメータ
 * @param skill_name スキル名
 * @param offset 検索結果の取得開始位置
 * @param limit 検索結果の最大件数
 */
interface SkillSearchParam {
    skill_name?: string;
    offset?:     number;
    limit?:   number;
}

/**
 * スキル検索結果
 * @property datas 検索結果
 * @property datas.skill_id スキルID
 * @property datas.skill_name スキル名
 * @property datas.type_code タイプコード
 * @property datas.skill_attr_code スキル属性コード
 * @property datas.skill_description スキル説明
 * @property datas.power 威力
 * @property datas.hit 命中率
 * @property datas.max_pp 最大PP
 * @property total 検索結果の総件数
 */
interface SkillSearchResult {
    datas: {
        skill_id: number;
        skill_name: string;
        type_code: string;
        skill_attr_code: string;
        skill_description: string;
        power: number | null;
        hit: number | null;
        max_pp: number | null;
    }[];
    total: number;
}

/**
 * スキル検索ストア
 */
export class SkillSearchStore {
    /**
     * スキル検索
     * @param param パラメータ
     * @returns 検索結果
     */
    async search(param: SkillSearchParam): Promise<SkillSearchResult> {
        // パラメータ作成
        const requestParams = {
            skill_name: param.skill_name || '',
            offset: param.offset || 0,
            limit: param.limit || 20,
        };
        const query_params = new URLSearchParams(requestParams as any); 

        // 検索実施
        const response = await fetch(`/api/skill/search?${query_params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch skills');
        }

        // 検索結果返却
        return response.json();
    }
}