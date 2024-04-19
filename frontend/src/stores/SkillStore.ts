import { Skill } from '@/types/Skill';

export class SkillStore {

    async fetchById(skill_id: number): Promise<Skill | undefined> {
        const response = await fetch(`/api/skill/${skill_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch skill');
        }
        return response.json();
    }
    
}
