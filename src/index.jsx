import React from 'react';
import { render } from 'react-dom';
import store from './reducers';
import App from './components/TwitchDigits/index.jsx';

render(<App />, document.getElementById('app'));
