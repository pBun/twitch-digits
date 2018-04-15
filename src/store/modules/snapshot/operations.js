import * as actions from './actions';

export function fetchSnapshot(time) {
    return (dispatch, getState, { api }) => {
        dispatch(actions.requestSnapshot());
        let path = time ? 'snapshot/' + time : 'snapshot';
        return api.get(path)
            .then(res => {
                dispatch(actions.receiveSnapshot(res));
            })
            .catch(err => {
                console.log(err);
            });
    }
};
