import { Skill } from '@/types/Skill';

export class SkillStore {

    async fetchById(skill_id: number): Promise<Skill | undefined> {
        const response = await fetch(`/api/skill/fetch/${skill_id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch skill');
        }
        const body = await response.json();
        return await body.data;
    }
    
    async add(skill: Skill): Promise<Skill> {
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
    
    async update(skill: Skill): Promise<Skill> {
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

        return await response.json();
    }
}
