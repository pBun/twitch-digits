require('./global.css');

var React = require('react');
var ReactDOM = require('react-dom');

var App = require('./App.jsx');
var el = <App name="test" />;
ReactDOM.render(el, document.getElementById('app'));