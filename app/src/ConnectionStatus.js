import React, { Component } from 'react';

import serverFeed from './ServerFeed';

class ConnectionStatus extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const connectionFeed = serverFeed.subscribe('connection');
    connectionFeed.on('data', message => this.log(message));
    const authFeed = serverFeed.subscribe('auth');
    authFeed.on('data', message => this.log(message));
    const timeFeed = serverFeed.subscribe('time');
    timeFeed.on('data', time => this.log(time));
    this.setState({connectionFeed, authFeed, timeFeed});
  }

  componentWillUnmount () {
    serverFeed.unsubscribe(this.connectionFeed);
    serverFeed.unsubscribe(this.authFeed);
    serverFeed.unsubscribe(this.timeFeed);
  }

  log(message) {
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
