import React, { Component } from 'react';

import serverFeed from './ServerFeed';

class ServerTime extends Component {
  constructor() {
    super();
    this.state = {};
    this.timeHandler = this.onTime.bind(this);
  }

  componentDidMount() {
    serverFeed.on('time', this.timeHandler)
  }

  componentWillUnmount () {
    serverFeed.removeListener(this.timeHandler);
  }

  onTime({time}) {
    this.setState({time});
  }

  render() {
    return (
      <div>Server Time: {this.state.time}</div>
    );
  }
}

export default ServerTime;
