import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import store from './reducers';
import App from './components/TwitchDigits/index.jsx';

render(<App />, document.getElementById('app'));
