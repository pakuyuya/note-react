import React from 'react';
import './SkillEditPage.css';
import { Route, withRouter } from 'react-router-dom';
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
 * @property ready 読み込み完了フラグ
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
 */
type SkillEditState = {
  ready: boolean;
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

  // stores
  typeStore = new TypeStore();
  attrStore = new AttrStore();
  skillStore = new SkillStore();

  // state定義

  /**
   * stateの初期値
   */
  plainState: SkillEditState = {
    ready: false,
    errorMessages: [],
    title: '',
    skill_name: '',
    skill_description: '',
    type_code: undefined,
    skill_attr_code: undefined,
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

  /**
   * ページ読み込み時の処理（マウント直後）
   */
  componentDidMount() {

    // セットするstateを初期化する
    const state = {...this.plainState};

    // 読み込み前から画面表示するデータを設定する
    if (this.props.editId === undefined) {
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
      this.props.editId === undefined ? Promise.resolve(undefined)
                                      : this.skillStore.fetchById(this.props.editId)
    ]).then(([types, attrs, skill]) => {
      // 全てのPromiseが正常終了した場合

      state.types = [this.typeStore.empty(), ...types];
      state.attrs = attrs;

      if (skill !== undefined) {
        // APIに問合せしてスキル情報が取得できた場合
        state.skill_name = skill.skill_name;
        state.skill_description = skill.skill_description;
        state.type_code = skill.type_code;
        state.skill_attr_code = skill.skill_attr_code;
        state.power = skill.power;
        state.hit = skill.hit;
        state.max_pp = skill.max_pp;
      }

      // 画面に反映
      this.setState(state);

    }).catch((err) => {
      // エラー時

      this.state.errorMessages = ['わざ情報の読み込みに失敗しました。ご迷惑をおかけしますが再実行をトライしてください。'];
      console.error(err);

      this.setState(state);
    });
  }

  clickAdd() {
    this.props.history.push('/skill/add/');
  }

  clickRemoveSelected() {
  }

  close() {
    (this.props.onClose || (() => {}))();
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
            {this.state.errorMessages.map((message) => (
              <div key={message} className="message-error">{message}</div>
            ))}
            <div className="field-row">
              <label className="field-label col-2">わざ名</label>
              <input className="col-6" type="text" value={this.state.skill_name} onChange={(e) => this.setState({skill_name: e.target.value})} />
            </div>
            <div className="field-row">
              <label className="field-label col-2">わざ説明</label>
              <input className="col-6" type="text" value={this.state.skill_description} onChange={(e) => this.setState({skill_description: e.target.value})} />
            </div>
            <div className="field-row">
              <label className="field-label col-2">タイプ</label>
              <select className="col-6" defaultValue={this.state.type_code}>
                {this.state.types.map(type => (
                  <option key={type.type_code} value={type.type_code}
                          onSelect={(e) => this.setState({type_code: type.type_code})}>{type.type_name}</option>
                ))}
              </select>
            </div>
            <div className="field-row">
              <label className="field-label col-2">属性</label>
              {this.state.attrs.map(attr => (
                <label key={attr.attr_code}>
                  <input type="radio" value={attr.attr_code} defaultChecked={attr.attr_code === this.state.skill_attr_code}
                        onClick={(e) => this.setState({skill_attr_code: attr.attr_code})} />{attr.attr_name}
                </label>
              ))}
            </div>
            <div className="field-row">
              <label className="field-label col-2">いりょく</label>
              <input className="col-1" type="number" value={this.state.power} onChange={(e) => this.setState({power: e.target.value})} />
            </div>
            <div className="field-row">
              <label className="field-label col-2">命中率</label>
              <input className="col-1" type="number" value={this.state.hit} onChange={(e) => this.setState({hit: e.target.value})} />
            </div>
            <div className="field-row">
              <label className="field-label col-2">最大PP</label>
              <input className="col-1" type="number" value={this.state.max_pp} onChange={(e) => this.setState({max_pp: e.target.value})} />
            </div>
          </div>
          <div className="dialog-command">
          <span className="col-2"><button onClick={() => this.clickAdd()} className="primary">保存</button></span>
          <span className="col-2"><button onClick={() => this.close()}>キャンセル</button></span>
          </div>
        </div>
      </div>
    );
  }

}


export default withRouter(SkillEditPage);
