import React, { Component } from 'react';

class DreamList extends Component {
  constructor() {
    super();
    this.state = {
      dreamList: []
    };
  }

  async componentDidMount() {
    // const dreamReceiver = dreamList => {
    //   this.setState({dreamList: [].concat(this.deamList, dreamList));
    // }
    // const dreamFeed = fetchFeed('dream', {existing: {}, new: {}})
    // dreamFeed.on('data', dreamReceiver)
    const response = await fetch('/api/dreams');
    const dreamList = await response.json();
    this.setState({dreamList});
  }

  async componentWillUnmount () {
    // dreamFeed.close()
  }

  render() {
    return (
    <div className="DreamList">
      <h3>All my dreams</h3>
      <ul>
      {this.state.dreamList.map(dream =>
        <li key={dream}>{dream}</li>
      )}
      </ul>
    </div>
    );
  }
}

export default DreamList;
