import React from 'react';
import './SkillPage.css';
import {withRouter} from 'react-router-dom';
import {RouteComponentProps} from 'react-router';

/**
 * SkillPageのstate型
 */
type SkillState = {
    /** 検索条件 */
    condition: {
        skill_name: string;
    }
    /** 一覧 */
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
      /** 属性コード */
      skill_attr_code: string;
      /** 属性名 */
      skill_attr_name: string;
      /** 威力 */
      power?: number;
      /** 命中 */
      hit?: number;
      /** PP */
      pp: number;
      /** 説明 */
      skill_description: string;
    }[]
    crtpage: number;
    lastpage: number;
    offset: number;
    pagesize: number;
}

class SkillPage extends React.Component<RouteComponentProps> {

  /**
   * state
   */
  state: SkillState = {
    condition: {
      skill_name: '',
    },
    items: [],
    crtpage: 1,
    lastpage: 1,
    offset: 0,
    pagesize: 20,
  };

  /**
   * ページ読み込み時の処理（マウント直後）
   */
  componentDidMount() {
    this.search();
  }

  /**
   * 検索
   */
  search() {
    // TODO: サーバーからデータを取得する

    // サンプルデータを設定
    this.setState({
      condition: {
        name: '',
      },
      items: [
        {
          checked: false,
          skill_id: 1,
          skill_name: 'たいあたり',
          type_code: 'normal',
          type_name: 'ノーマル',
          skill_attr_code: 'physical',
          skill_attr_name: '物理',
          power: 40,
          hit: 100,
          pp: 35,
        },
        {
          checked: false,
          skill_id: 2,
          skill_name: 'かみなり',
          type_code: 'electric',
          type_name: 'でんき',
          skill_attr_code: 'special',
          skill_attr_name: '特殊',
          power: 110,
          hit: 70,
          pp: 10,
        },
      ],
      crtpage: 1,
      lastpage: 0,
      offset: 0,
      pagesize: 20,
    });
  }

  clickAdd() {
    this.props.history.push('/skill/add/');
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
   * 画面描画
   * @returns HTML要素
   */
  render() {

    return (
      <div className="Skill">
        <div className="condition">
          <form onSubmit={this.onSearch}>
            <label className="condition-label col-1">わざ</label>
            <input className="condition-text col-2" type="text" name="skill_name" value={this.state.condition.skill_name} onChange={(e) => this.setState({condition: {skill_name: e.target.value}})} />
            <button type="submit" className="primary" onClick={() => this.search()}>検索</button>
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
        </div>
      </div>
    );
  }

  onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    // ブラウザのデフォルト動作をキャンセル（Submit）
    e.preventDefault();

    // TODO: 検索メソッド呼出し
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
      <button onClick={() => onPageSelect(1)} className="secondary">最初</button>
    )
  }
  for (let i = pagestart; i <= pageend; i++) {
    buttons.push(
      <button key={i} onClick={() => onPageSelect(i)} className="secondary">{i}</button>
    );
  }
  if (pageend >= 0) {
    buttons.push(
      <button onClick={() => onPageSelect(pageend)} className="secondary">最後</button>
    )
  }

  return (
    <div className="PageMoveButtons">
      {buttons}
    </div>
  );
}

export default withRouter(SkillPage);
