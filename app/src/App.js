import {Socket} from 'engine.io-client';
import React, { Component } from 'react';

import logo from './logo.svg';
import './App.css';
import DreamList from './DreamList';

class App extends Component {
  constructor() {
    super();
    this.state = {
    };
  }

  componentDidMount() {
    const socket = new Socket('ws://localhost:3001/');
    socket.on('open', () => {
      console.log('socket connected');
      // socket.send(new Int8Array(5));
      socket.on('message', message => {
        // console.log('socket message', blob);
        this.setState({
          serverMessage: message
        });
      });
      socket.on('close', () => {
        console.log('socket closed');
      });
    });
  }

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
        <p>Server message: {this.state.serverMessage}</p>
      </div>
    );
  }
}

export default App;
