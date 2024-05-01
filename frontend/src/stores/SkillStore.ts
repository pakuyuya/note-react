import { Skill } from '@/types/Skill';

/**
 * わざストア
 */
export class SkillStore {

    /**
     * わざ１件取得
     * @param skill_id わざID
     * @returns わざ情報。見つからない場合はundefined
     */
    async fetchById(skill_id: number): Promise<Skill | undefined> {
        const response = await fetch(`/api/skill/fetch/${skill_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch skill');
        }
        const body = await response.json();
        return await body.data;
    }
    
    /**
     * わざ追加
     * @param skill わざ情報
     * @returns わざID
     */
    async add(skill: Skill): Promise<Skill> {
        // リクエストの送信
        const response = await fetch('/api/skill/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(skill),
        });
        if (!response.ok) {
            console.error(response.body);
            throw new Error('Failed to add skill');
        }
        const body = await response.json();
        return body.data;
    }

    /**
     * わざ更新
     * @param skill わざ情報
     * @returns 
     */
    async update(skill: Skill): Promise<Skill> {
        // リクエストの送信
        const response = await fetch(`/api/skill/update/${skill.skill_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(skill),
        });
        if (!response.ok) {
            console.error(response.body);
            throw new Error('Failed to update skill');
        }
        
        const body = await response.json();
        return body.data;
    }

    /**
     * わざ削除
     * @param skill_ids わざIDリスト
     * @returns 削除件数
     */
    async remove(skill_ids: number[]): Promise<number> {
        // リクエストの送信
        const response = await fetch(`/api/skill/remove`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({skill_ids: skill_ids}),
        });
        if (!response.ok) {
            console.error(response.body);
            throw new Error('Failed to remove skills');
        }
        
        const body = await response.json();
        return body.data;
    }
}
