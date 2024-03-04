import React from 'react';
import './App.css';
import toggleImg from './image/bars_24.svg';


class App extends React.Component {
  
  state = { hideMenu: false };

  render() {
    const htmlMenu = 
      !this.state.hideMenu ? 
      (  <ul>
          <li><a href="#">ポケモン検索</a></li>
          <li><a href="#">わざ管理</a></li>
          <li><a href="#">特性管理</a></li>
          <li><a href="#">どうぐ管理</a></li>
        </ul>
      ) : '' ;

    return (
      <div className="App">
        <header className="App-header">
          <h1>ポケモンDB</h1>
          <nav className="App-header-nav">
            <ul>
              <li><a href="#">ログアウト</a></li>
            </ul>
          </nav>
        </header>
        <div className="App-content">
          <nav className={'sidebar ' + (this.state.hideMenu ? 'hide' : '')}>
            <div className="toggleMenu"  onClick={() => this.toggleMenu()} >
              <img src={toggleImg} alt="toggle menu" width="38px"/>
            </div>
            {htmlMenu}
          </nav>
        </div>
      </div>
    );
  }

  toggleMenu = () => {
    const newState = {
      hideMenu: !this.state.hideMenu
    }
    this.setState(newState);    
  }

}

export default App;
