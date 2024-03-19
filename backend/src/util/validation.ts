
/**
 * 文字入力がされているかをチェックする<br>
 * 
 * @param s 検査対象の文字列
 * @param name 項目名
 * @returns エラー無しの場合undefined。エラーありの場合エラーメッセージ
 */
export function isRequired(s:string | undefined, name:string): string | undefined {
    if (s === undefined || s === null || s === '') {
        return `${name}が指定されていません`;
    }
    return undefined;
}

/**
 * 入力文字が半角整数であるかをチェックする<br>
 * 最大値・最小値のチェックも行う<br>
 * ただし、空文字・undefined・nullはエラーとしない<br>
 * 
 * @param s 検査対象の文字列
 * @param name 項目名
 * @param opt.min 最小値。省略時はチェックしない
 * @param opt.max 最大値。省略時はチェックしない
 * @returns エラー無しの場合undefined。エラーありの場合エラーメッセージ
 */
export function isNumeric(s:string | undefined, name:string, opt?:{min?:number, max?: number}): string | undefined {
    if (s === undefined || s === null || s === '') {
        return undefined;
    }

    if (!s.match(/^[-\d]+$/)) {
        return `${name}に半角数字以外が指定されています`;
    }
    if (s.length >= 14) {
        // Note: JavaScriptのNumber型は、整数の桁を53ビットまでしか保持できず、
        //       9007199254740992(=2^53)を超える整数は正確に表現できない
        //       そのため、14桁以上の整数の利用を制限する
        return `${name}が扱える整数の最大値を超えています`;
    }

    if (opt !== undefined) {
        const n = parseInt(s, 10);
        if (opt.min !== undefined && n < opt.min) {
            return `${name}が${opt.min}を下回っています`;
        }
        if (opt.max !== undefined && n > opt.max) {
            return `${name}が${opt.max}を上回っています`;
        }
    }

    return undefined;
}

/**
 * 入力文字の最大桁数をチェックする<br>
 * 
 * @param s 検査対象の文字列
 * @param name 項目名
 * @param len 最大桁数
 * @returns エラー無しの場合undefined。エラーありの場合エラーメッセージ
 */
export function isMaxlen(s:string | undefined, name:string, len: number): string | undefined {
    if (s === undefined || s === null) {
        return undefined;
    }

    if (s.length > len) {
        return `${name}が${len}桁を超えています`;
    }

    return undefined;
}
