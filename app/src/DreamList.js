import React, { Component } from 'react';
import serverFeed from "./ServerFeed";

class DreamList extends Component {
  constructor() {
    super();
    this.state = {
      dreamSet: []
    };
    this.dreamInput = React.createRef();
    this.dreamInsertedHandler = this.onDreamInserted.bind(this);
  }

  handleSubmit = event => {
    const title = this.dreamInput.current.value;
    fetch('/api/dream', {
      method: 'POST',
      body: JSON.stringify({title}),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('submit', title);
    this.dreamInput.current.value = '';
    event.preventDefault();
  }

  async componentDidMount() {
    // ToDo
    // const dreamReceiver = dreamList => {
    //   this.setState({dreamList: [].concat(this.deamList, dreamList));
    // }
    // const dreamFeed = fetchFeed('dream', {existing: {}, new: {}})
    // dreamFeed.on('data', dreamReceiver)
    const response = await fetch('/api/dreams');
    const dreamSet = await response.json();
    this.setState({dreamSet});
    serverFeed.on('dream:inserted', this.dreamInsertedHandler);
  }

  async componentWillUnmount () {
    serverFeed.removeListener(this.dreamInsertedHandler);
  }

  onDreamInserted (dream) {
    this.setState({dreamSet: Object.assign({
      [dream.id]: dream
    }, this.state.dreamSet)});
  }

  render() {
    return (
    <div className="DreamList">
      <h3>All my dreams</h3>
      <ul>
      {Object.keys(this.state.dreamSet).map(id =>
        <li key={id}>{this.state.dreamSet[id].title}</li>
      )}
      </ul>
      <form onSubmit={this.handleSubmit}>
        <input type="text" ref={this.dreamInput} />
        <input type="submit" value="Add dream!"/>
      </form>
    </div>
    );
  }
}

export default DreamList;
