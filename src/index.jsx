import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store';
import TwitchDigitsContainer from './containers/TwitchDigitsContainer';

const reduxDevToolsState = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const store = configureStore(reduxDevToolsState);
class App extends React.Component {
  render(){
    return(
      <Provider store={store}>
        <TwitchDigitsContainer />
      </Provider>
    );
  }
}
render(<App />, document.getElementById('app'));
