import reconnect from 'engine.io-reconnect';
import {Socket} from 'engine.io-client';
import React, { Component } from 'react';

class ConnectionStatus extends Component {
  constructor() {
    super();
    this.state = {
      message: 'not connected'
    };
  }

  componentDidMount() {
    const location = window.location;
    const isEncrypted = location.protocol === 'https:';
    const protocol = isEncrypted ? 'wss:' : 'ws:';
    const hostname = location.hostname;
    const port = location.port ? `:${location.port}` : '';
    const url = `${protocol}//${hostname}${port}/`;
    const socket = new Socket(url);
    const reconnector = reconnect(socket, {
      timeout: false
    });
    socket.on('open', () => {
      this.log('connected');
      // socket.send(new Int8Array(5));
      socket.on('message', message => {
        // console.log('socket message', blob);
        this.log(message);
      });
      socket.on('close', () => {
        this.log('disconnected');
      });
    });
    reconnector.on('reconnect', attemptCount => {
      this.log(`reconnected after ${attemptCount} attempts`);
    });

    reconnector.on('reconnecting', attemptCount => {
      this.log(`reconnecting after ${attemptCount} attempts`);
    });

    reconnector.on('reconnect_error', error => {
      this.log(`failed to reconnect: ${error}`);
    });

    reconnector.on('reconnect_timeout', timeout => {
      this.log(`timeout after ${timeout}ms`);
    });
  }

  log(message) {
    console.log(message);
    this.setState({
      message: message
    });
  }

  render() {
    return (
      <div>Server message: {this.state.message}</div>
    );
  }
}

export default ConnectionStatus;
