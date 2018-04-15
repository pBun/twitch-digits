import * as types from './types';

export function requestSnapshot() {
    return {
        type: types.SNAPSHOT_REQUEST
    };
};

export function receiveSnapshot(snapshot) {
    return {
        type: types.SNAPSHOT_RECEIVE,
        payload: snapshot,
        receivedAt: Date.now()
    };
};
