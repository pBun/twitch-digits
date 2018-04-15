import { connect } from 'react-redux';
import TwitchDigits from '../components/TwitchDigits'
import * as snapshotOperations from '../store/modules/snapshot/operations';
import * as summaryOperations from '../store/modules/summarySnapshots/operations';

function mapStateToProps(state) {
    return {
        summaries: state.summarySnapshots,
        snapshot: state.snapshot
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadSummaries: () => dispatch(summaryOperations.fetchSummaries()),
        addSummary: (summary) => dispatch(summaryOperations.addSummary(summary)),
        loadSnapshot: (time) => dispatch(snapshotOperations.fetchSnapshot(time))
    };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TwitchDigits);
