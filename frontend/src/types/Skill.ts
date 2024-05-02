/**
 * わざ
 * @property skill_id わざID
 * @property skill_name わざ名
 * @property skill_description わざ説明
 * @property type_code タイプコード
 * @property skill_attr_code わざ種別コード
 * @property power 威力
 * @property hit 命中率
 * @property max_pp 最大PP
 */
export type Skill = {
    skill_id: number;
    skill_name: string;
    skill_description: string;
    type_code: string;
    skill_attr_code: string;
    power: number;
    hit: number;
    max_pp: number;
}
