import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import summarySnapshots from './modules/summarySnapshots/reducers';
import snapshot from './modules/snapshot/reducers'
import twitchPubApi from '../lib/twitchPub';

// middlewares
const createStoreWithMiddleware = applyMiddleware(
	thunk.withExtraArgument({api: twitchPubApi})
)(createStore);

// root reducer
const reducer = combineReducers({
	summarySnapshots,
	snapshot
});

const configureStore = (initialState) => createStoreWithMiddleware(reducer, initialState);
export default configureStore;
