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
    // ToDo: extract socket component
    const socket = new Socket(); // Note: will connect back to originating host and port
    const reconnector = reconnect(socket, {
      timeout: false
    });
    socket.on('open', () => {
      this.log('connected');
      socket.send('authToken');
      // ToDo: serverMessageFeed
      socket.on('message', json => {
        const message = JSON.parse(json);
        switch (message.channel) {
          case 'auth':
            this.log(message.payload);
            break;
          case 'time':
            this.log(message.payload);
            break;
        }
      });
      socket.on('close', () => {
        this.log('disconnected');
      });
    });
    reconnector.on('reconnect', attemptCount => {
      this.log(`reconnected after ${attemptCount} attempts`);
      socket.send('authToken');
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
      <div>Connection Status: {this.state.message}</div>
    );
  }
}

export default ConnectionStatus;
