import React from 'react';
import {withRouter} from 'react-router-dom';
import {RouteComponentProps} from 'react-router';

import './SkillPage.css';

import SkillEditPage from './SkillEditPage';
import {SkillSearchStore} from '@/stores/SkillSearchStore';
import { TypeStore } from '@/stores/TypeStore';
import { AttrStore } from '@/stores/AttrStore';

/**
 * SkillPageのstate型
 * @property condition 検索条件
 * @property condition.skill_name わざ名
 * @property items リスト
 * @property crtpage 現在ページ
 * @property lastpage 最終ページ
 * @property offset オフセット
 * @property pagesize ページサイズ
 * @property showDialog ダイアログ表示フラグ
 * @property dialogSkillId ダイアログの技ID
 */
type SkillState = {
    condition: {
        skill_name: string;
    }
    items: {
      /** 選択状態 */
      checked: boolean;
      /** 技ID */
      skill_id: number;
      /** 技名 */
      skill_name: string;
      /** タイプコード */
      type_code: string;
      /** タイプ名 */
      type_name: string;
      /** 威力 */
      power?: number;
      /** 命中 */
      hit?: number;
      /** 説明 */
      skill_description: string;
    }[];
    crtpage: number;
    lastpage: number;
    offset: number;
    pagesize: number;
    showDialog: boolean;
    dialogSkillId: number | undefined;
}

const skillSearchApiClient = new SkillSearchStore();

class SkillPage extends React.Component<RouteComponentProps> {

  /**
   * state
   */
  state: SkillState = {
    condition: {
      skill_name: '',
    },
    items: [],
    crtpage: 0,
    lastpage: 0,
    offset: 0,
    pagesize: 0,
    showDialog: false,
    dialogSkillId: undefined,
  };

  typeStore = new TypeStore();
  attrStore = new AttrStore();

  /**
   * ページ読み込み時の処理（マウント直後）
   */
  componentDidMount() {
    this.search();
  }
  
  submitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    // ブラウザのデフォルト動作をキャンセル（Submit）
    e.preventDefault();

    // TODO: 検索メソッド呼出し
  }

  clickAdd() {
    this.setState({showDialog: true});
    const dialog = document.getElementById('skillEditDialog') as HTMLDialogElement;
    dialog.showModal();
  }

  clickCloseDialog() {
    this.setState({showDialog: false});
    const dialog = document.getElementById('skillEditDialog') as HTMLDialogElement;
    dialog.close();
  }

  clickRemoveSelected() {
    const items = this.state.items.filter((item) => !item.checked);
    this.setState({items: items});
  }

  clickHeaderChecked(e: React.MouseEvent<HTMLInputElement>) {
    const tobeChecked = e.currentTarget.checked;
    const items = this.state.items.slice();
    for (let i = 0; i < items.length; i++) {
      items[i].checked = tobeChecked;
    }
    this.setState({items: items});
  }

  clickItemChecked(index: number) {
    const items = this.state.items.slice();
    items[index].checked = !items[index].checked;
    this.setState({items: items});
  }

  
  /**
   * 検索
   */
  search() {
    // TODO: サーバーからデータを取得する
    skillSearchApiClient.search({
      skill_name: this.state.condition.skill_name,
      offset: this.state.offset,
      limit: this.state.pagesize,
    }).then(async (result) => {

      // 検索結果の配列をmapを使って変換
      const items = [];

      for (const data of result.datas) {
        items.push({
          // 選択状態
          checked: false,
          // id
          skill_id: data.skill_id,
          // わざ
          skill_name: data.skill_name,
          // タイプ
          type_name: await this.typeStore.getName(data.type_code),
          // 威力（0または設定無しの場合、'-'を表示）
          power: data.power || '-',
          // 命中（0または設定無しの場合、'-'を表示）
          hit: data.hit || '-',
          // 説明
          skill_description: data.skill_description,
        });
      }

      this.setState({
        items: items,
        lastpage: Math.ceil(result.total / this.state.pagesize),
      });
    });

  }

  /**
   * 画面描画
   * @returns HTML要素
   */
  render() {

    return (
      <div className="Skill">
        <div className="condition">
          <form onSubmit={(e) => this.submitSearch(e)}>
            <label className="condition-label col-1">わざ</label>
            <input className="condition-text col-2" type="text" name="skill_name" value={this.state.condition.skill_name} onChange={(e) => this.setState({condition: {skill_name: e.target.value}})} />
            <button type="submit" className="primary">検索</button>
          </form>
        </div>
        <div className="list">
          <nav className="list-nav">
            <div className="list-pages">
              {renderPageMoveButtons(this.state.crtpage, this.state.lastpage, this.state.pagesize, (page) => {})}
            </div>
            <div className="list-cmd">
              <button className="primary" onClick={() => this.clickAdd()}>＋新規作成</button>
            </div>
          </nav>
          <table>
            <tbody>
            <tr key={'header'}>
              <th className="col-1 text-center">
                <input type="checkbox" onClick={(e) => this.clickHeaderChecked(e)} />
              </th>
              <th className="col-3">わざ</th>
              <th className="col-1">タイプ</th>
              <th className="col-1">威力</th>
              <th className="col-1">命中</th>
              <th className="col-5">説明</th>
            </tr>
            {this.state.items.map((item, i) =>  (
              <tr key={item.skill_id}>
                <td className="text-center"><input type="checkbox" checked={item.checked} onClick={(e) => this.clickItemChecked(i)} /></td>
                <td className="text-left">{item.skill_name}</td>
                <td className="text-center skill-type">{item.type_name}</td>
                <td className="text-center">{item.power}</td>
                <td className="text-center">{item.hit}</td>
                <td className="text-left">{item.skill_description}</td>
              </tr>
            ))}
            </tbody>
          </table>
          <nav className="list-nav">
            <div className="list-pages"></div>
            <div className="list-cmd">
              <button className="secondary" onClick={(e) => this.clickRemoveSelected()}>選択したものを削除</button>
            </div>
          </nav>
          <dialog id="skillEditDialog">
            {(this.state.showDialog) ? <SkillEditPage editId={this.state.dialogSkillId} onClose={() => this.clickCloseDialog()} /> : null}
          </dialog>
        </div>
      </div>
    );
  }

}

/**
 * ページ移動ボタンのレンダリング
 * @param crtpage 現在ページ
 * @param lastpage 最終ページ
 * @param maxViewPage 最大表示ページ数
 * @param onPageSelect ページ選択時のコールバック関数
 * @returns HTML要素
 */
function renderPageMoveButtons(crtpage: number, lastpage: number, maxViewPages: number, onPageSelect: (page: number) => void): JSX.Element {

  const pagestart = Math.max(1, Math.min(crtpage - Math.floor(maxViewPages / 2), lastpage - maxViewPages + 1));
  let pageend = Math.min(lastpage, pagestart + maxViewPages - 1);
  if (pageend < pagestart) {
    pageend = pagestart;
  }

  const buttons: JSX.Element[] = [];
  if (pagestart >= 1) {
    buttons.push(
      <button key={'first'} onClick={() => onPageSelect(1)} className="secondary">最初</button>
    )
  }
  for (let i = pagestart; i <= pageend; i++) {
    buttons.push(
      <button key={i} onClick={() => onPageSelect(i)} className="secondary">{i}</button>
    );
  }
  if (pageend >= 0) {
    buttons.push(
      <button key={'last'} onClick={() => onPageSelect(pageend)} className="secondary">最後</button>
    )
  }

  return (
    <div className="PageMoveButtons">
      {buttons}
    </div>
  );
}

export default withRouter(SkillPage);
