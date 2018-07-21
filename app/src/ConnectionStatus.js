import React, { Component } from 'react';

import serverFeed from './ServerFeed';

class ConnectionStatus extends Component {
  constructor() {
    super();
    this.state = {};
    this.connectionStatusHandler = this.onConnectionStatus.bind(this);
  }

  componentDidMount() {
    serverFeed.on('connection:status', this.connectionStatusHandler)
  }

  componentWillUnmount () {
    serverFeed.removeListener(this.connectionStatusHandler);
  }

  onConnectionStatus({status}) {
    this.setState({status});
  }

  render() {
    return (
      <div>Connection Status: {this.state.status}</div>
    );
  }
}

export default ConnectionStatus;
