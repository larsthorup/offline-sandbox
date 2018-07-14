import React, { Component } from 'react';

import serverFeed from './ServerFeed';

class AuthStatus extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const authFeed = serverFeed.subscribe('auth');
    authFeed.on('data', message => this.log(message));
    this.setState({authFeed});
  }

  componentWillUnmount () {
    serverFeed.unsubscribe(this.authFeed);
  }

  log(message) {
    this.setState({
      message: message
    });
  }

  render() {
    return (
      <div>Auth Status: {this.state.message}</div>
    );
  }
}

export default AuthStatus;
