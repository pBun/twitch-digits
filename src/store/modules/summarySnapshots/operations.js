import actions from "./actions";

function fetchSummaries() {
	return (dispatch, getState, { api }) => {
        dispatch(actions.requestSummaries());

        return api.get('snapshot/times')
            .then(res => {
                dispatch(actions.receiveSummaries(res));
            })
            .catch(err => {
                console.log(err);
            });
    }
};

export default {
    fetchSummaries,
    addSummary: actions.addSummary
};
