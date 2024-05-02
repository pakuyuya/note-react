import { Type } from '@/types/Type';

/**
 * タイプストア
 */
export class TypeStore {

    /**
     * タイプ定義
     */
    types: Type[] = [
        { type_code: '01', type_name: 'ノーマル', bgColor: '#A8A77A', textColor: '#000000'},
        { type_code: '02', type_name: 'ほのお', bgColor: '#A8A77A', textColor: '#000000' },
        { type_code: '03', type_name: 'みず', bgColor: '#A8A77A', textColor: '#000000' },
        { type_code: '04', type_name: 'でんき', bgColor: '#A8A77A', textColor: '#000000' },
        { type_code: '05', type_name: 'くさ', bgColor: '#A8A77A', textColor: '#000000' },
        { type_code: '06', type_name: 'こおり', bgColor: '#A8A77A', textColor: '#000000' },
        { type_code: '07', type_name: 'かくとう', bgColor: '#A8A77A', textColor: '#000000' },
        { type_code: '08', type_name: 'どく', bgColor: '#A8A77A', textColor: '#000000' },
        { type_code: '09', type_name: 'じめん', bgColor: '#A8A77A', textColor: '#000000' },
        { type_code: '10', type_name: 'ひこう', bgColor: '#A8A77A', textColor: '#000000' },
        { type_code: '11', type_name: 'エスパー', bgColor: '#A8A77A', textColor: '#000000' },
        { type_code: '12', type_name: 'むし', bgColor: '#A8A77A', textColor: '#000000' },
        { type_code: '13', type_name: 'いわ', bgColor: '#A8A77A', textColor: '#000000' },
        { type_code: '14', type_name: 'ゴースト', bgColor: '#A8A77A', textColor: '#000000' },
        { type_code: '15', type_name: 'ドラゴン', bgColor: '#A8A77A', textColor: '#000000' },
        { type_code: '16', type_name: 'あく', bgColor: '#A8A77A', textColor: '#000000' },
        { type_code: '17', type_name: 'はがね', bgColor: '#A8A77A', textColor: '#000000' },
        { type_code: '18', type_name: 'フェアリー', bgColor: '#A8A77A', textColor: '#000000' },
    ];

    /**
     * 空のタイプ定義を取得
     * @returns 空のタイプ
     */
    empty(): Type {
        return { type_code: '', type_name: '', bgColor: '#FFFFFF', textColor: '#000000'};
    }

    /**
     * タイプコードから定義を取得
     * @param type_code タイプコード
     * @returns タイプの定義。見つからない場合はundefined
     */
    async getName(type_code: string): Promise<string | undefined> {
        return this.types.find(type => type.type_code === type_code)?.type_name;
    }

    /**
     * すべてのタイプを取得
     * @returns タイプの一覧
     */
    async fetchAll(): Promise<Type[]> {
        return [...this.types];
    }
}