import React, { Component } from 'react';

import serverFeed from './ServerFeed';

class AuthStatus extends Component {
  constructor() {
    super();
    this.state = {};
    this.authStatusHandler = this.onAuthStatus.bind(this);
  }

  componentDidMount() {
    serverFeed.on('auth:status', this.authStatusHandler)
  }

  componentWillUnmount () {
    serverFeed.removeListener(this.authStatusHandler);
  }

  onAuthStatus({isAuthorized}) {
    console.log({isAuthorized})
    this.setState({
      message: `${isAuthorized ? '' : 'not '}authorized`
    });
  }

  render() {
    return (
      <div>Auth Status: {this.state.message}</div>
    );
  }
}

export default AuthStatus;
