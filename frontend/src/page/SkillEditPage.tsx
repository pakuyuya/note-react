import React from 'react';
import './SkillEditPage.css';
import { withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Type } from '@/types/Type';
import { TypeStore } from '@/stores/TypeStore';
import { Skill } from '@/types/Skill';
import { SkillStore } from '@/stores/SkillStore';
import { Attr } from '@/types/Attr';
import { AttrStore } from '@/stores/AttrStore';

type SkilEditProps = RouteComponentProps & {
  editId: number | undefined;
  onClose: () => void;
}

/**
 * SkillPageのstate型
 * @property skill_id わざID
 * @property ready 読み込み完了フラグ
 * @property infoMessages 情報メッセージ
 * @property errorMessages エラーメッセージ
 * @property title ダイアログタイトル
 * @property skill_name わざ名
 * @property skill_description わざ説明
 * @property type_code わざタイプ
 * @property skill_attr_code わざ属性
 * @property power 威力
 * @property hit 命中率
 * @property max_pp 最大PP
 * @property effect 効果
 * @property types タイプ一覧（選択肢）
 * @property attrs 種別一覧（選択肢）
 */
type SkillEditState = {
  skill_id: number | undefined;
  ready: boolean;
  infoMessages: string[];
  errorMessages: string[];
  title: string;
  skill_name: string;
  skill_description: string;
  type_code: string | undefined;
  skill_attr_code: string | undefined;
  power: number | undefined;
  hit: number | undefined;
  max_pp: number | undefined;
  types: Type[];
  attrs: Attr[];
}

class SkillEditPage extends React.Component<SkilEditProps> {

  // ---------------------------------------
  // storeの定義
  // ---------------------------------------
  typeStore = new TypeStore();
  attrStore = new AttrStore();
  skillStore = new SkillStore();

  // ---------------------------------------
  // state定義
  // ---------------------------------------

  /**
   * stateの初期値
   */
  plainState: SkillEditState = {
    skill_id: undefined,
    ready: false,
    infoMessages: [],
    errorMessages: [],
    title: '',
    skill_name: '',
    skill_description: '',
    type_code: this.typeStore.empty().type_code,
    skill_attr_code: this.attrStore.empty().attr_code,
    power: undefined,
    hit: undefined,
    max_pp: undefined,
    types: [],
    attrs: [],
  };

  /**
   * state
   */
  state: SkillEditState = {...this.plainState};

  // ---------------------------------------
  // イベントハンドラ
  // ---------------------------------------

  /**
   * ページ読み込み時の処理（マウント直後）
   */
  componentDidMount() {

    // 呼出し元コンポーネントのeditId指定値を元に画面を起動する
    this.reload(this.props.editId);

  }

  clickSave() {
    // validation
    const errorMessages = this.validate();

    if (errorMessages.length > 0) {
      this.setState({errorMessages: errorMessages});
      return;
    }
    this.setState({errorMessages: [], infoMessages: []});

    this.save()
      .then((skill) => {
        this.reload(skill.skill_id)
            .then(() => {
              this.setState({infoMessages: ['保存しました']});
            });
      });
  }

  // ---------------------------------------
  // 各処理のprivateメソッド
  // ---------------------------------------

  /**
   * 画面を読み込む
   * @param skill_id 技ID。undefinded地の場合は新規登録、値ありの場合は編集
   */
  async reload(skill_id: number | undefined) {
    const state = {...this.plainState};

    // 読み込み前から画面表示するデータを設定する
    if (state.skill_id === undefined) {
      state.title = 'わざ登録';
    } else {
      state.title = 'わざ編集';
    }

    // 非同期問合せ前に画面に反映
    this.setState(state);

    // API問合せ・各種読み込み開始
    Promise.all([
      this.typeStore.fetchAll(),
      this.attrStore.fetchAll(),
      state.skill_id === undefined ? Promise.resolve(undefined)
                                   : this.skillStore.fetchById(state.skill_id)
    ]).then(([types, attrs, skill]) => {
      // 全てのPromiseが正常終了した場合

      // タイプ一覧：先頭に空の選択肢を追加、後ろに全タイプの配列をスプレッド展開して追加
      state.types = [this.typeStore.empty(), ...types];
      // 種別一覧
      state.attrs = attrs;

      if (skill !== undefined) {
        // APIに問合せしてスキル情報が取得できた場合、stateに反映

        // わざ名
        state.skill_name = skill.skill_name;
        // わざ説明
        state.skill_description = skill.skill_description;
        // タイプ
        state.type_code = skill.type_code;
        // 種別
        state.skill_attr_code = skill.skill_attr_code;
        // 威力
        state.power = skill.power;
        // 命中率
        state.hit = skill.hit;
        // 最大PP
        state.max_pp = skill.max_pp;
      }

      // 読み込み完了フラグを立てる
      state.ready = true;

      // 画面に反映
      this.setState(state);

    }).catch((err) => {
      // 想定外のエラー時
      state.errorMessages = ['処理に失敗しました。再度実行して改善しない場合、管理者にお問い合わせください'];
      console.error(err);

      this.setState(state);
    })
    .catch((err) => {
      console.error(err);
      this.setState({errorMessages: ['処理に失敗しました。再度実行して改善しない場合、管理者にお問い合わせください']});
    });
  }

  /**
   * ダイアログを閉じる
   */
  close() {
    (this.props.onClose || (() => {}))();
  }

  /**
   * 入力チェック
   * @returns エラーメッセージ。エラー無しの場合空の配列
   */
  validate() : string[] {
    const errors: string[] = [];
    
    const state = this.state;
    if (state.skill_name.trim() === '') {
      errors.push('わざ名を入力してください');
    }
    if (state.skill_name.trim() !== '' && state.skill_name.length > 30) {
      errors.push('わざ名は30文字以内で入力してください');
    }
    if (state.skill_description.trim() !== '' && state.skill_description.length > 400) {
      errors.push('わざ名は400文字以内で入力してください');
    }
    if (state.type_code === this.typeStore.empty().type_code) {
      errors.push('タイプを選択してください');
    }
    if (state.skill_attr_code === this.attrStore.empty().attr_code) {
      errors.push('種別を選択してください');
    }
    if (state.max_pp === undefined || state.max_pp <= 0) {
      errors.push('最大PPは1以上の数値を入力してください');
    }

    return errors;
  }

  async save(): Promise<Skill> {
    const state = this.state;
    const skill : Skill =
      {
        skill_id: state.skill_id || 0,
        skill_name: state.skill_name,
        skill_description: state.skill_description,
        type_code: state.type_code || '',
        skill_attr_code: state.skill_attr_code || '',
        power: state.power || 0,
        hit: state.hit || 0,
        max_pp: state.max_pp || 0,
      };
    
    return state.skill_id === undefined ? this.skillStore.add(skill)
                                        : this.skillStore.update(skill);
  }


  /**
   * 画面描画
   * @returns HTML要素
   */
  render() {

    return (
      <div className="SkillEdit">
        <div>
          <div className="dialog-header">
            <h1 className="dialog-header-title">{this.state.title}</h1>
            <span className="dialog-header-close" onClick={() => this.close()}></span>
          </div>
          <div className="dialog-content">
            {this.state.infoMessages.map((message) => (
              <div key={message} className="message-info">{message}</div>
            ))}
            {this.state.errorMessages.map((message) => (
              <div key={message} className="message-error">{message}</div>
            ))}
            <div className="field-row">
              <label className="field-label col-2">わざ名</label>
              <input className="col-6" type="text" value={this.state.skill_name} onChange={(e) => this.setState({skill_name: e.target.value})} disabled={!this.state.ready} />
            </div>
            <div className="field-row">
              <label className="field-label col-2">わざ説明</label>
              <input className="col-6" type="text" value={this.state.skill_description} onChange={(e) => this.setState({skill_description: e.target.value})} disabled={!this.state.ready} />
            </div>
            <div className="field-row">
              <label className="field-label col-2">タイプ</label>
              <select className="col-6" defaultValue={this.state.type_code} disabled={!this.state.ready} onChange={(e) => this.setState({type_code: e.target.value})}>
                {this.state.types.map(type => (
                  <option key={type.type_code} value={type.type_code}
                          onSelect={(e) => this.setState({type_code: type.type_code})}>{type.type_name}</option>
                ))}
              </select>
            </div>
            <div className="field-row">
              <label className="field-label col-2">種別</label>
              {this.state.attrs.map(attr => (
                <label key={attr.attr_code}>
                  <input type="radio" value={attr.attr_code} defaultChecked={attr.attr_code === this.state.skill_attr_code}
                        onClick={(e) => this.setState({skill_attr_code: attr.attr_code})} disabled={!this.state.ready} />{attr.attr_name}
                </label>
              ))}
            </div>
            <div className="field-row">
              <label className="field-label col-2">いりょく</label>
              <input className="col-1" type="number" value={this.state.power} onChange={(e) => this.setState({power: e.target.value})} disabled={!this.state.ready} />
            </div>
            <div className="field-row">
              <label className="field-label col-2">命中率</label>
              <input className="col-1" type="number" value={this.state.hit} onChange={(e) => this.setState({hit: e.target.value})} disabled={!this.state.ready} />
            </div>
            <div className="field-row">
              <label className="field-label col-2">最大PP</label>
              <input className="col-1" type="number" value={this.state.max_pp} onChange={(e) => this.setState({max_pp: e.target.value})} disabled={!this.state.ready} />
            </div>
          </div>
          <div className="dialog-command">
          <span className="col-2"><button onClick={() => this.clickSave()} className="primary" disabled={!this.state.ready}>保存</button></span>
          <span className="col-2"><button onClick={() => this.close()}>キャンセル</button></span>
          </div>
        </div>
      </div>
    );
  }

}


export default withRouter(SkillEditPage);
