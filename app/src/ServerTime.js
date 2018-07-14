import React, { Component } from 'react';

import serverFeed from './ServerFeed';

class ServerTime extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const timeFeed = serverFeed.subscribe('time');
    timeFeed.on('data', time => this.log(time));
    this.setState({timeFeed});
  }

  componentWillUnmount () {
    serverFeed.unsubscribe(this.timeFeed);
  }

  log(time) {
    this.setState({
      time: time
    });
  }

  render() {
    return (
      <div>Server Time: {this.state.time}</div>
    );
  }
}

export default ServerTime;
