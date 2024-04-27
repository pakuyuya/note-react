interface SkillSearchParam {
    skill_name?: string;
    offset?:     number;
    limit?:   number;
}

interface SkillSearchResult {
    datas: {
        skill_id: number;
        skill_name: string;
        type_code: string;
        type_name: string;
        skill_attr_code: string;
        skill_attr_name: string;
        skill_description: string;
        power: number | null;
        hit: number | null;
        max_pp: number | null;
    }[];
    total: number;
}

export class SkillSearchStore {
    async search(param: SkillSearchParam): Promise<SkillSearchResult> {
        const requestParams = {
            skill_name: param.skill_name || '',
            offset: param.offset || 0,
            limit: param.limit || 20,
        };

        const query_params = new URLSearchParams(requestParams as any); 

        const response = await fetch(`/api/skill/search?${query_params}`);
        if (!response.ok) {
            throw new Error('Failed to fetch skills');
        }
        return response.json();
    }
}