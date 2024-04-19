import { Attr } from '@/types/Attr';

export class AttrStore {
    attrs: Attr[] = [
        { attr_code: '1', attr_name: '物理', },
        { attr_code: '2', attr_name: '特殊',  },
        { attr_code: '3', attr_name: '変化',  },
    ];

    async fetchByCode(attr_code: string): Promise<Attr | undefined> {
        return this.attrs.find(attr => attr.attr_code === attr_code);
    }

    async fetchAll(): Promise<Attr[]> {
        return [...this.attrs];
    }
}
