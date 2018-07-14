import React, { Component } from 'react';

import logo from './logo.svg';
import './App.css';
import AuthStatus from './AuthStatus';
import ConnectionStatus from './ConnectionStatus';
import DreamList from './DreamList';
import ServerTime from './ServerTime';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <DreamList />
        <ConnectionStatus/>
        <AuthStatus/>
        <ServerTime/>
      </div>
    );
  }
}

export default App;
