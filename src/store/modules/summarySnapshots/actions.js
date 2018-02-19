import types from "./types";

function requestSummaries() {
    return {
        type: types.SUMMARIES_REQUEST
    };
};

function receiveSummaries(summaries) {
    return {
        type: types.SUMMARIES_RECEIVE,
        payload: summaries,
        receivedAt: Date.now()
    };
};

function addSummary(summary) {
    console.log(summary);
    return {
        type: types.SUMMARY_ADD,
        payload: summary
    };
};

export default {
    requestSummaries,
    receiveSummaries,
    addSummary
};