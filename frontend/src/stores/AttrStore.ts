import { Attr } from '@/types/Attr';

/**
 * 種別ストア
 */
export class AttrStore {
    attrs: Attr[] = [
        { attr_code: '1', attr_name: '物理', },
        { attr_code: '2', attr_name: '特殊',  },
        { attr_code: '3', attr_name: '変化',  },
    ];

    /**
     * 空の種別を１件取得する
     * @returns 空の種別
     */
    empty(): Attr {
        return { attr_code: '', attr_name: '', };
    }

    /**
     * 種別コードから種別を１件取得する
     * @param attr_code 種別コード 
     * @returns 種別。見つからない場合はundefined
     */
    async fetchByCode(attr_code: string): Promise<Attr | undefined> {
        return this.attrs.find(attr => attr.attr_code === attr_code);
    }

    /**
     * 全ての種別を取得する
     * @returns 種別のリスト
     */
    async fetchAll(): Promise<Attr[]> {
        return [...this.attrs];
    }
}
