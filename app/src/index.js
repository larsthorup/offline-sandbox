import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import serverFeed from './ServerFeed';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
serverFeed.authenticating('authToken');