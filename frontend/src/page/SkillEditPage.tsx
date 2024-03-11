import React from 'react';
import './SkillPage.css';
import {Route, withRouter} from 'react-router-dom';
import {RouteComponentProps} from 'react-router';

/**
 * SkillPageのstate型
 */
type SkillEditState = {
}

// TODO: ダイアログ化
class SkillEditPage extends React.Component<RouteComponentProps> {

  /**
   * state
   */
  state: SkillEditState = {
  };

  /**
   * ページ読み込み時の処理（マウント直後）
   */
  componentDidMount() {
  }

  clickAdd() {
    this.props.history.push('/skill/add/');
  }

  clickRemoveSelected() {
  }

  /**
   * 画面描画
   * @returns HTML要素
   */
  render() {

    return (
      <div className="Skill">
        <div>
          <button type="button" className="secondary" onClick={() => this.props.history.goBack()}>戻る</button>
        </div>
      </div>
    );
  }

}


export default withRouter(SkillEditPage);
