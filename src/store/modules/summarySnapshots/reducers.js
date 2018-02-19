import { combineReducers } from "redux";
import types from "./types";

function summaries(state = [], action = {}) {
    switch (action.type) {
        case types.SUMMARIES_REQUEST:
            return state;
        case types.SUMMARIES_RECEIVE:
            return action.payload;
        case types.SUMMARY_ADD:
        	return [ ...state, action.paylaod ];
        default:
            return state;
    }
};

export default summaries;
