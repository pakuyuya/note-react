import React from 'react';
import './App.css';
import toggleImg from './image/bars_24.svg';
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
  Redirect 
} from 'react-router-dom';

class App extends React.Component {
  
  state = { hideMenu: false };

  render() {

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
            {(!this.state.hideMenu) ? (
              <ul>
                <li><Link to="/pokemon">ポケモン検索</Link></li>
                <li><Link to="/skill">わざ管理</Link></li>
                <li><Link to="/ability">特性管理</Link></li>
              </ul>
            ) : (
              ''
            )}
          </nav>
          <div className="main">
            <BrowserRouter>
              <Switch>
                <Route path="/pokemon">
                  <h2>ポケモン検索</h2>
                </Route>
                <Route path="/skill">
                  <h2>わざ管理</h2>
                </Route>
                <Route path="/ability">
                  <h2>特性管理</h2>
                </Route>
                <Route>
                  <Redirect to="/pokemon" />
                </Route>
              </Switch>
            </BrowserRouter>
          </div>
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
