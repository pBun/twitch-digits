import types from "./types";

function requestSnapshot() {
    return {
        type: types.SNAPSHOT_REQUEST
    };
};

function receiveSnapshot(snapshot) {
    return {
        type: types.SNAPSHOT_RECEIVE,
        payload: snapshot,
        receivedAt: Date.now()
    };
};


export default {
    requestSnapshot,
    receiveSnapshot
};