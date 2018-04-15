import { combineReducers } from 'redux';
import * as types from './types';

export default function snapshot(state = null, action = {}) {
    switch (action.type) {
        case types.SNAPSHOT_REQUEST:
            return state;
        case types.SNAPSHOT_RECEIVE:
            return action.payload;
        default:
            return state;
    }
};
