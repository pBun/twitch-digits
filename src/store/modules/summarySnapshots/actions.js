import * as types from './types';

export function requestSummaries() {
    return {
        type: types.SUMMARIES_REQUEST
    };
};

export function receiveSummaries(summaries) {
    return {
        type: types.SUMMARIES_RECEIVE,
        payload: summaries,
        receivedAt: Date.now()
    };
};

export function addSummary(summary) {
    console.log(summary);
    return {
        type: types.SUMMARY_ADD,
        payload: summary
    };
};
